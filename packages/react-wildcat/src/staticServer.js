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

let server;

function start() {
    const wildcatConfig = require("./utils/getWildcatConfig")(cwd);

    const {
        generalSettings,
        serverSettings
    } = wildcatConfig;

    const {
        staticServer: staticServerSettings
    } = serverSettings;

    const {
        secureSettings
    } = staticServerSettings;

    const lifecycleHook = (lifecycle) => {
        if (typeof staticServerSettings[lifecycle] === "function") {
            staticServerSettings[lifecycle].call(this, wildcatConfig);
        }
    };

    lifecycleHook("onBeforeStart");

    const morganOptions = getMorganOptions(generalSettings.logLevel, serverSettings);

    const __PROD__ = (process.env.NODE_ENV === "production");
    const __TEST__ = (process.env.BABEL_ENV === "test");

    let babelOptions = {};

    let cpuCount = staticServerSettings.maxClusterCpuCount;

    if (cpuCount === Infinity) {
        cpuCount = os.cpus().length;
    }

    if (!__PROD__ || __TEST__) {
        const babelRcPath = path.join(cwd, ".babelrc");

        if (pathExists.sync(babelRcPath)) {
            babelOptions = JSON.parse(fs.readFileSync(babelRcPath));
        }

        https.globalAgent.options.rejectUnauthorized = false;

        if (!wildcatConfig.__ClusterServerTest__) {
            cpuCount = staticServerSettings.minClusterCpuCount;
        }
    }
    const port = Number(staticServerSettings.port);

    const allowedOrigins = (staticServerSettings.corsOrigins).concat([staticServerSettings.host]);

    const fileServer = serve({
        root: cwd,
        index: false,
        hidden: false,
        gzip: staticServerSettings.gzip
    });

    return new Promise(function startPromise(resolve) {
        /* istanbul ignore if */
        if (cluster.isMaster) {
            lifecycleHook("onBeforeClusterFork");

            for (let i = 0, c = cpuCount; i < c; i++) {
                cluster.fork();
            }

            cluster.on("exit", function clusterExit(worker, code, signal) {
                logger.warn(`worker ${worker.process.pid} has died (code: ${code}) (signal: ${signal})`);

                if (staticServerSettings.reconnectOnWorkerDisconnect === true) {
                    logger.warn(`Starting a new worker`);
                    cluster.fork();
                }
            });

            resolve({
                clusterForksCount: cpuCount
            });
        } else {
            lifecycleHook("onWorkerStart");

            const app = koa();

            lifecycleHook("onStart");

            // enable cors
            app.use(cors({
                origin: function origin(ctx) {
                    for (let i = 0, j = allowedOrigins.length; i < j; i++) {
                        const allowedOrigin = allowedOrigins[i];
                        const hostname = ctx.header.host.split(":")[0];

                        /* istanbul ignore else */
                        if (hostname.includes(allowedOrigin)) {
                            return "*";
                        }
                    }

                    /* istanbul ignore next */
                    return false;
                }
            }));

            // add gzip
            app.use(compress());

            app.use(morgan.middleware(":id :status :method :url :res[content-length] - :response-time ms", morganOptions));

            if (!__PROD__ || __TEST__) {
                const webpack = require("webpack");
                const webpackDevServer = require("koa-webpack-dev-middleware");
                const {webpackDevConfigFile} = generalSettings;

                if (fs.existsSync(webpackDevConfigFile)) {
                    const webpackConfig = require(path.resolve(cwd, webpackDevConfigFile));
                    app.use(webpackDevServer(webpack(webpackConfig), webpackConfig.devServer));
                }
            }

            // serve statics
            app.use(fileServer);

            let serverType;

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
                    server,
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
                        logger.ok("Static server is running on pid", process.pid);
                    } else {
                        logger.ok(`Static server is running at ${generalSettings.staticUrl} on pid`, process.pid);
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
    if (!server || !server.close) {
        return undefined;
    }

    return server.close();
}

exports.start = start;
exports.close = close;
