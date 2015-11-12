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

const cwd = process.cwd();
const path = require("path");

const http = require("http");
const http2 = require("spdy");
const https = require("https");

const morgan = require("koa-morgan");
require("./utils/customMorganTokens")(morgan, `🏈`);

const Logger = require("./utils/logger");
const logger = new Logger(`🏈`);

const renderReactWithJSPM = require("./middleware/renderReactWithJSPM");

let server;

function start() {
    const wildcatConfig = require("./utils/getWildcatConfig")(cwd);
    const generalSettings = wildcatConfig.generalSettings;
    const serverSettings = wildcatConfig.serverSettings;

    const appServerSettings = serverSettings.appServer;
    const secureSettings = appServerSettings.secureSettings;

    const routeCache = {};

    const __PROD__ = (process.env.NODE_ENV === "production");
    const __TEST__ = (process.env.BABEL_ENV === "test");

    let cpuCount = os.cpus().length;

    /* istanbul ignore else */
    if (!__PROD__ || __TEST__) {
        https.globalAgent.options.rejectUnauthorized = false;
        cpuCount = 1;
    }

    const originPort = Number(appServerSettings.port);

    return new Promise(resolve => {
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

            /* istanbul ignore else */
            if (!__PROD__ || process.env.DANGEROUSLY_ENABLE_PROXIES_IN_PRODUCTION || __TEST__) {
                const proxy = require("./middleware/proxy");

                app.use(proxy(appServerSettings.proxies, {
                    logger: logger
                }));
            }

            app.use(renderReactWithJSPM(cwd, {
                cache: routeCache,
                wildcatConfig: wildcatConfig
            }));

            if (appServerSettings.protocol === "http") {
                server = http.createServer(app.callback());
            } else {
                const serverType = appServerSettings.protocol === "http2" ? http2 : https;
                server = serverType.createServer(secureSettings, app.callback());
            }

            if (!__PROD__) {
                const connectToWebSocketServer = require("./utils/connectToWebSocketServer");

                connectToWebSocketServer({
                    cache: routeCache,
                    cpuCount: cpuCount,
                    cluster: cluster,
                    logger: logger,
                    maxRetries: 10,
                    retryTimer: 10000,
                    url: generalSettings.staticUrl.replace(/http/, "ws")
                });
            }

            server.listen(port, () => {
                /* istanbul ignore else */
                if (cluster.worker.id === cpuCount) {
                    if (__PROD__) {
                        logger.ok(`Node server is running`);
                    } else {
                        logger.ok(`Node server is running at ${generalSettings.originUrl}`);
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
