"use strict";

const os = require("os");
const sticky = require("sticky-socket-cluster");
const cluster = require("cluster");

const koa = require("koa");
const cors = require("koa-cors");
const etag = require("koa-etag");
const favicon = require("koa-favicon");
const compress = require("koa-compress");
const conditional = require("koa-conditional-get");

const fs = require("fs-extra");
const path = require("path");

const http2 = require("spdy");
const https = require("https");

const morgan = require("koa-morgan");
require("./utils/customMorganTokens")(morgan, `🏈`);

const Logger = require("./utils/logger");
const logger = new Logger(`🏈`);

const routeCache = {};

const renderReactWithJSPM = require("./middleware/renderReactWithJSPM");

const cwd = process.cwd();
const wildcatConfig = require(path.join(cwd, "wildcat.config"));
const generalSettings = wildcatConfig.generalSettings;
const serverSettings = wildcatConfig.serverSettings;

const __PROD__ = (process.env.NODE_ENV === "production");
const __TEST__ = (process.env.BABEL_ENV === "test");

let cpuCount = os.cpus().length;

if (!__PROD__ || __TEST__) {
    https.globalAgent.options.rejectUnauthorized = false;
    cpuCount = 1;
}

const originPort = Number(process.env.PORT || serverSettings.port || 80);

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

sticky({
    "workers": cpuCount,
    "first_port": originPort,
    "proxy_port": originPort + 100
}, (port) => {
    const app = koa();

    app.use(morgan.middleware(":id :status :method :url :res[content-length] - :response-time ms"));

    // enable cors
    app.use(cors());

    // use conditional upstream from etag so that they are present
    app.use(conditional());

    // add etags
    app.use(etag());

    // add gzip
    app.use(compress());

    // Handle the pesky favicon
    app.use(favicon(path.join(cwd, "favicon.ico")));

    if (!__PROD__ || __TEST__ || process.env.DANGEROUSLY_ENABLE_PROXIES_IN_PRODUCTION) {
        const proxy = require("./middleware/proxy");

        app.use(proxy(serverSettings.proxies || {}, {
            logger: logger
        }));
    }

    app.use(renderReactWithJSPM({
        cache: routeCache,
        wildcatConfig: wildcatConfig
    }));

    const server = (serverSettings.http2 ? http2 : https).createServer(serverOptions, app.callback());

    if (!__PROD__) {
        const connectToWebSocketServer = require("./utils/connectToWebSocketServer");

        connectToWebSocketServer({
            cache: routeCache,
            cpuCount: cpuCount,
            cluster: cluster,
            logger: logger,
            maxRetries: 10,
            retryTimer: 10000,
            url: generalSettings.staticUrl.replace(/https?/, "wss")
        });
    }

    server.listen(port, () => {
        if (cluster.worker.id === cpuCount) {
            if (__PROD__) {
                logger.ok(`Node server is running`);
            } else if (generalSettings.originUrl) {
                logger.ok(`Node server is running at ${generalSettings.originUrl}`);
            }
        }
    });
});
