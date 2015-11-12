"use strict";

const os = require("os");
const sticky = require("sticky-socket-cluster");
const cluster = require("cluster");

const koa = require("koa");
const cors = require("koa-cors");
const compress = require("koa-compress");
const serve = require("koa-file-server");

const fs = require("fs-extra");
const cwd = process.cwd();
const path = require("path");
const pathExists = require("path-exists");

const http = require("http");
const http2 = require("spdy");
const https = require("https");

const morgan = require("koa-morgan");
require("./utils/customMorganTokens")(morgan, `☁️`);

const Logger = require("./utils/logger");
const logger = new Logger(`☁`);

const babelDevTranspiler = require("./middleware/babelDevTranspiler");

let server;

function start() {
    const wildcatConfig = require("./utils/getWildcatConfig")(cwd);
    const generalSettings = wildcatConfig.generalSettings;
    const serverSettings = wildcatConfig.serverSettings;

    const staticServerSettings = serverSettings.staticServer;
    const secureSettings = staticServerSettings.secureSettings;

    const __PROD__ = (process.env.NODE_ENV === "production");
    const __TEST__ = (process.env.BABEL_ENV === "test");

    let babelOptions = {};
    let cpuCount = os.cpus().length;

    /* istanbul ignore else */
    if (!__PROD__ || __TEST__) {
        const babelRcPath = path.join(cwd, ".babelrc");

        /* istanbul ignore else */
        if (pathExists.sync(babelRcPath)) {
            babelOptions = JSON.parse(fs.readFileSync(babelRcPath));
        }

        https.globalAgent.options.rejectUnauthorized = false;
        cpuCount = 1;
    }

    const staticPort = Number(staticServerSettings.port);
    const allowedOrigins = (staticServerSettings.corsOrigins).concat([staticServerSettings.host]);

    const fileServer = serve({
        root: cwd,
        index: false,
        hidden: false
    });

    const LOG_LEVEL = Number(process.env.LOG_LEVEL) || 0;

    /* istanbul ignore next */
    const morganOptions = LOG_LEVEL > 0 ? {
        skip: (req, res) => res.statusCode < 400
    } : {};

    return new Promise(resolve => {
        sticky({
            "workers": cpuCount,
            "first_port": staticPort,
            "proxy_port": staticPort + 100
        }, (port) => {
            const app = koa();

            app.use(morgan.middleware(":id :status :method :url :res[content-length] - :response-time ms", morganOptions));

            // enable cors
            app.use(cors({
                origin: (ctx) => {
                    /* istanbul ignore next */
                    for (let i = 0, j = allowedOrigins.length; i < j; i++) {
                        const allowedOrigin = allowedOrigins[i];
                        const hostname = ctx.header.host.split(":")[0];

                        if (hostname.includes(allowedOrigin)) {
                            return "*";
                        }
                    }

                    /* istanbul ignore next */
                    return false;
                }
            }));

            /* istanbul ignore else */
            if (!__PROD__ || __TEST__) {
                app.use(babelDevTranspiler(cwd, {
                    babelOptions,
                    binDir: serverSettings.binDir,
                    extensions: [".es6", ".js", ".es", ".jsx"],
                    logger,
                    origin: generalSettings.staticUrl,
                    outDir: serverSettings.publicDir,
                    sourceDir: serverSettings.sourceDir
                }));
            }

            // add gzip
            app.use(compress());

            // serve statics
            app.use(fileServer);


            if (staticServerSettings.protocol === "http") {
                server = http.createServer(app.callback());
            } else {
                const serverType = staticServerSettings.protocol === "http2" ? http2 : https;
                server = serverType.createServer(secureSettings, app.callback());
            }

            if (!__PROD__) {
                const startWebSocketServer = require("./utils/startWebSocketServer");

                startWebSocketServer(cwd, {
                    cache: fileServer.cache,
                    origin: generalSettings.staticUrl,
                    server: server,
                    watchOptions: {
                        ignored: /node_modules|jspm_packages|src/,
                        ignoreInitial: true,
                        persistent: true
                    }
                });
            }

            server.listen(port, () => {
                /* istanbul ignore else */
                if (cluster.worker.id === cpuCount) {
                    if (__PROD__) {
                        logger.ok(`Static server is running`);
                    } else {
                        logger.ok(`Static server is running at ${generalSettings.staticUrl}`);
                    }

                    resolve({
                        env: process.env.NODE_ENV,
                        server
                    });
                }
            });
        });
    });
}

function close() {
    return new Promise(resolve => server.close(resolve));
}

exports.start = start;
exports.close = close;
