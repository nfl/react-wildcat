"use strict";

const os = require("os");
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
const getMorganOptions = require("./utils/getMorganOptions");
require("./utils/customMorganTokens")(morgan, "☁️");

const Logger = require("./utils/logger");
const logger = new Logger("☁️");

const babelDevTranspiler = require("./middleware/babelDevTranspiler");

let server;

function start() {
    const wildcatConfig = require("./utils/getWildcatConfig")(cwd);
    const generalSettings = wildcatConfig.generalSettings;
    const serverSettings = wildcatConfig.serverSettings;

    const staticServerSettings = serverSettings.staticServer;
    const secureSettings = staticServerSettings.secureSettings;

    const morganOptions = getMorganOptions(generalSettings.logLevel, serverSettings);

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

    const port = Number(staticServerSettings.port);

    const allowedOrigins = (staticServerSettings.corsOrigins).concat([staticServerSettings.host]);

    const fileServer = serve({
        root: cwd,
        index: false,
        hidden: false,
        gzip: __PROD__ && !__TEST__
    });

    /* istanbul ignore if */
    if (cluster.isMaster) {
        for (let i = 0, c = cpuCount; i < c; i++) {
            cluster.fork();
        }

        cluster.on("exit", function clusterExit(worker, code, signal) {
            logger.warn(`worker ${worker.process.pid} has died (code: ${code}) (signal: ${signal})`);
        });
    } else {
        return new Promise(function startPromise(resolve) {
            const app = koa();

            app.use(morgan.middleware(":id :status :method :url :res[content-length] - :response-time ms", morganOptions));

            // enable cors
            app.use(cors({
                origin: function origin(ctx) {
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
                    coverage: generalSettings.coverage,
                    coverageSettings: generalSettings.coverageSettings,
                    extensions: [".es6", ".js", ".es", ".jsx"],
                    logger,
                    logLevel: generalSettings.logLevel,
                    origin: generalSettings.staticUrl,
                    outDir: serverSettings.publicDir,
                    sourceDir: serverSettings.sourceDir
                }));
            }

            // add gzip
            app.use(compress());

            // serve statics
            app.use(fileServer);

            var serverType;

            switch (staticServerSettings.protocol) {
                case "http2":
                    serverType = http2;
                    break;

                case "https":
                    serverType = https;
                    break;

                case "http":
                default:
                    serverType = http;
                    break;
            }

            // Stop Limiting Your Connections with Default MaxSockets Value
            // http://webapplog.com/seven-things-you-should-stop-doing-with-node-js/
            (serverType.globalAgent || https.globalAgent).maxSockets = Infinity;

            if (staticServerSettings.protocol === "http") {
                server = serverType.createServer(app.callback());
            } else {
                server = serverType.createServer(secureSettings, app.callback());
            }

            if (!__PROD__) {
                const startWebSocketServer = require("./utils/startWebSocketServer");

                startWebSocketServer(cwd, {
                    cache: fileServer.cache,
                    server: server,
                    watchOptions: {
                        awaitWriteFinish: {
                            pollInterval: 100,
                            stabilityThreshold: 250
                        },
                        ignored: /\.(git|gz|map)|node_modules|jspm_packages|src/,
                        ignoreInitial: true,
                        persistent: true
                    }
                });
            }

            server.listen(port, function serverListener() {
                /* istanbul ignore else */
                if (cluster.worker.id === cpuCount) {
                    if (__PROD__) {
                        logger.ok("Static server is running");
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
    }
}

function close() {
    return server.close();
}

exports.start = start;
exports.close = close;
