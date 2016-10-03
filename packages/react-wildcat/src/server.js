"use strict";

const os = require("os");
const cluster = require("cluster");

const koa = require("koa");
const cors = require("koa-cors");
const etag = require("koa-etag");
const proxy = require("koa-proxy");
const compress = require("koa-compress");
const conditional = require("koa-conditional-get");

const cwd = process.cwd();

const http = require("http");
const http2 = require("spdy");
const https = require("https");

const morgan = require("koa-morgan");
const getMorganOptions = require("./utils/getMorganOptions");
require("./utils/customMorganTokens")(morgan, "🏈");

const Logger = require("./utils/logger");
const logger = new Logger("🏈");

const renderReactWithJspm = require("./middleware/renderReactWithJspm");

let server;

function start() {
    const wildcatConfig = require("./utils/getWildcatConfig")(cwd);

    if (wildcatConfig.generalSettings.logLevel === 4) {
        require("./memory");
    }

    const generalSettings = wildcatConfig.generalSettings;
    const serverSettings = wildcatConfig.serverSettings;

    const appServerSettings = serverSettings.appServer;
    const secureSettings = appServerSettings.secureSettings;
    const proxySettings = appServerSettings.proxies;

    const lifecycleHook = (lifecycle) => {
        if (typeof appServerSettings[lifecycle] === "function") {
            appServerSettings[lifecycle].call(this, wildcatConfig);
        }
    };

    lifecycleHook("onBeforeStart");

    const morganOptions = getMorganOptions(generalSettings.logLevel, serverSettings);

    const __PROD__ = (process.env.NODE_ENV === "production");
    const __TEST__ = (process.env.BABEL_ENV === "test");

    let cpuCount = appServerSettings.maxClusterCpuCount;

    if (cpuCount === Infinity) {
        cpuCount = os.cpus().length;
    }

    if (!__PROD__ || __TEST__) {
        https.globalAgent.options.rejectUnauthorized = false;

        if (!wildcatConfig.__ClusterServerTest__) {
            cpuCount = appServerSettings.minClusterCpuCount;
        }
    }

    const port = Number(appServerSettings.port);

    return new Promise(function startPromise(resolve) {
        /* istanbul ignore if */
        if (cluster.isMaster) {
            lifecycleHook("onBeforeClusterFork");

            for (let i = 0; i < cpuCount; i++) {
                cluster.fork();
            }

            cluster.on("exit", function clusterExit(worker, code, signal) {
                logger.warn(`worker ${worker.process.pid} has died (code: ${code}) (signal: ${signal})`);
            });

            resolve({
                clusterForksCount: cpuCount
            });
        } else {
            lifecycleHook("onWorkerStart");

            const app = koa();

            lifecycleHook("onStart");

            app.use(morgan.middleware(":id :status :method :url :res[content-length] - :response-time ms", morganOptions));

            // enable cors
            app.use(cors());

            // use conditional upstream from etag so that they are present
            app.use(conditional());

            // add etags
            app.use(etag());

            // add gzip
            app.use(compress());

            Object.keys(proxySettings).forEach(function eachProxyRoute(proxyRoute) {
                const host = proxySettings[proxyRoute];

                if (cluster.worker.id === cpuCount) {
                    logger.meta(`Proxy: ${proxyRoute} -> ${host}`);
                }

                /* istanbul ignore next */
                app.use(proxy({
                    host,
                    map: (hostPath) => hostPath.replace(proxyRoute, ""),
                    match: proxyRoute
                }));
            });

            // Allow custom middleware priority over react/jspm/render from below
            // otherwise server-only routes will receive 404's.
            if (appServerSettings.middleware && appServerSettings.middleware.length) {
                appServerSettings.middleware.forEach(function eachCustomAppMiddleware(middlewareConfigFunction, index) {
                    if (typeof middlewareConfigFunction === "function") {
                        middlewareConfigFunction(app, wildcatConfig);
                    } else {
                        const errorMsg = `
Middleware at serverSettings.appServer.middleware[${index}] could not be correclty initialized. Expecting middleware to have the following signature:
    function(app, wildcatConfig) { /* custom middleware */ }
    Erroring middleware: ${(middlewareConfigFunction || "").toString()}`;
                        logger.error(errorMsg, middlewareConfigFunction);
                    }
                });
            }

            app.use(renderReactWithJspm(cwd, {
                logger,
                wildcatConfig
            }));

            let serverType;

            switch (appServerSettings.protocol) {
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

            if (appServerSettings.protocol === "http") {
                server = serverType.createServer(app.callback());
            } else {
                server = serverType.createServer(secureSettings, app.callback());
            }

            server.listen(port, function serverListener() {
                /* istanbul ignore else */
                if (cluster.worker.id === cpuCount) {
                    if (__PROD__) {
                        logger.ok("Node server is running on pid", process.pid);
                    } else {
                        logger.ok(`Node server is running at ${generalSettings.originUrl} on pid`, process.pid);
                    }

                    lifecycleHook("onAfterStart");

                    resolve({
                        env: process.env.NODE_ENV,
                        server
                    });
                }
            });
        }
    });
}

function close() {
    if (server && server.close) {
        server.close();
    }
}

exports.start = start;
exports.close = close;
