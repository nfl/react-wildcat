"use strict";

const os = require("os");
const sticky = require("sticky-socket-cluster");
const cluster = require("cluster");

const koa = require("koa");
const cors = require("koa-cors");
const compress = require("koa-compress");
const serve = require("koa-file-server");

const fs = require("fs-extra");
const url = require("url");
const path = require("path");
const pathExists = require("path-exists");

const http2 = require("spdy");
const https = require("https");

const morgan = require("koa-morgan");
require("./utils/customMorganTokens")(morgan, `☁️`);

const Logger = require("./utils/logger");
const logger = new Logger(`☁`);

const babelDevTranspiler = require("./middleware/babelDevTranspiler");

const cwd = process.cwd();
const wildcatConfig = require(path.join(cwd, "wildcat.config"));
const generalSettings = wildcatConfig.generalSettings;
const serverSettings = wildcatConfig.serverSettings;

const __PROD__ = (process.env.NODE_ENV === "production");
const __TEST__ = (process.env.BABEL_ENV === "test");

let babelOptions = {};
let cpuCount = os.cpus().length;

if (!__PROD__ || __TEST__) {
    const babelRcPath = path.join(cwd, ".babelrc");

    if (pathExists.sync(babelRcPath)) {
        babelOptions = JSON.parse(fs.readFileSync(babelRcPath));
    }

    https.globalAgent.options.rejectUnauthorized = false;
    cpuCount = 1;
}

const staticParts = url.parse(generalSettings.staticUrl);

const staticPort = Number(process.env.STATIC_PORT || staticParts.port || 80);
const allowedOrigins = (serverSettings.corsOrigins || []).concat([staticParts.host]);

const ssl = !!(process.env.SSL !== "false");
const sslDir = path.join(__dirname, "..", "ssl");

const serverOptions = {
    key: fs.readFileSync(path.join(sslDir, "server.key")),
    cert: fs.readFileSync(path.join(sslDir, "server.crt")),
    ca: fs.readFileSync(path.join(sslDir, "server.csr")),
    protocols: [
        "h2",
        "spdy/3.1",
        "spdy/3",
        "spdy/2",
        "http/1.1",
        "http/1.0"
    ],
    ssl: ssl
};

const fileServer = serve({
    root: cwd,
    index: false,
    hidden: false
});

const LOG_LEVEL = Number(process.env.LOG_LEVEL) || 0;
const morganOptions = LOG_LEVEL > 0 ? {skip: (req, res) => res.statusCode < 400} : {};

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
            for (let i = 0, j = allowedOrigins.length; i < j; i++) {
                const allowedOrigin = allowedOrigins[i];
                const hostname = ctx.header.host.split(":")[0];

                if (hostname.includes(allowedOrigin)) {
                    return "*";
                }
            }

            return false;
        }
    }));

    if (!__PROD__ || __TEST__) {
        app.use(babelDevTranspiler(cwd, {
            babelOptions: babelOptions,
            binDir: serverSettings.binDir,
            extensions: [".es6", ".js", ".es", ".jsx"],
            logger: logger,
            origin: generalSettings.staticUrl,
            outDir: serverSettings.publicDir,
            sourceDir: serverSettings.sourceDir
        }));
    }

    // add gzip
    app.use(compress());

    // serve statics
    app.use(fileServer);

    const server = (serverSettings.http2 ? http2 : https).createServer(serverOptions, app.callback());

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
        if (cluster.worker.id === cpuCount) {
            if (__PROD__) {
                logger.ok(`Static server is running`);
            } else {
                logger.ok(`Static server is running at ${generalSettings.staticUrl}`);
            }
        }
    });
});
