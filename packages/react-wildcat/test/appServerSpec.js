"use strict";

const co = require("co");
const cp = require("child_process");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const cwd = process.cwd();
const path = require("path");
const os = require("os");

const chalk = require("chalk");
const cluster = require("cluster");
const proxyquire = require("proxyquire");

/* eslint-disable max-nested-callbacks */
describe("react-wildcat", () => {
    const exampleDir = path.join(cwd, "example");
    const customEmoji = "🏈";

    const NullConsoleLogger = (() => {
        function Logger() {}

        Logger.prototype = {
            info: () => {},
            meta: () => {},
            ok: () => {},
            warn: () => {},
            error: () => {}
        };

        return Logger;
    })();

    before(() => {
        process.chdir(exampleDir);
    });

    context("polyfills", () => {
        context("fetch", () => {
            const fetch = require("../src/utils/fetch.js");

            it("adds fetch polyfill", () => {
                expect(fetch)
                    .to.exist;

                expect(global.fetch)
                    .to.be.a("function")
                    .that.equals(fetch);
            });

            context("fetches data", () => {
                before(() => {
                    sinon.stub(global, "fetch");
                    global.fetch.returns(Promise.resolve());
                });

                it("return valid data", (done) => {
                    fetch("http://example.com", {})
                        .then(() => done());
                });

                it("compensates for missing protocol", (done) => {
                    fetch("//example.com")
                        .then(() => done());
                });

                after(() => {
                    global.fetch.restore();
                });
            });
        });

        context("baseURI", () => {
            it("adds baseURI polyfill", () => {
                const baseURI = require("../src/utils/baseURI.js");

                expect(baseURI)
                    .to.exist;

                expect(global.baseURI)
                    .to.be.a("string")
                    .that.equals(baseURI);
            });
        });
    });

    context("utils", () => {
        context("customMorganTokens", () => {
            const morgan = require("koa-morgan");

            const customMorganTokens = require("../src/utils/customMorganTokens.js")(morgan, customEmoji);

            it("bootstraps morgan logger", () => {
                expect(customMorganTokens)
                    .to.exist;
            });

            context("id", () => {
                it("logs custom IDs", () => {
                    const id = customEmoji;

                    expect(customMorganTokens)
                        .to.have.property("id");

                    const result = customMorganTokens.id({
                        id
                    });

                    expect(result)
                        .to.be.a("string")
                        .that.equals(chalk.styles.gray.open + `${id}  ~>` + chalk.styles.gray.close);
                });
            });

            context("status", () => {
                [
                    {code: 200, color: "cyan"},
                    {code: 301, color: "magenta"},
                    {code: 404, color: "red"},
                    {code: 500, color: "red"}
                ].forEach(status => {
                    it(`logs ${status.code} status codes`, () => {
                        expect(customMorganTokens)
                            .to.have.property("status");

                        const result = customMorganTokens.status({}, {
                            statusCode: status.code
                        });

                        expect(result)
                            .to.be.a("string")
                            .that.equals(chalk.styles[status.color].open + status.code + chalk.styles[status.color].close);
                    });
                });
            });

            context("url", () => {
                ["originalUrl", "url"].forEach(parameter => {
                    it(`logs requests using req.${parameter}`, () => {
                        const url = "/flexbox-example";

                        expect(customMorganTokens)
                            .to.have.property("url");

                        const result = customMorganTokens.url({
                            [parameter]: url
                        });

                        expect(result)
                            .to.be.a("string")
                            .that.equals(chalk.styles.gray.open + (url) + chalk.styles.gray.close);
                    });
                });
            });
        });

        context("logger", () => {
            const wildcatConfig = require("../src/utils/getWildcatConfig")(exampleDir);

            it("bootstraps custom logger", () => {
                const CustomLogger = proxyquire("../src/utils/logger.js", {});

                expect(CustomLogger)
                    .to.exist;

                const customLoggerInstance = new CustomLogger(customEmoji);

                expect(customLoggerInstance)
                    .to.be.an.instanceof(CustomLogger);
            });

            it("logger.error outputs an Error stack trace", () => {
                const CustomLogger = require("../src/utils/logger.js");

                const getErrorColor = (str) => {
                    return chalk.styles.red.open + str + chalk.styles.red.close;
                };

                const errorStub = new Error("test error");
                const errorIdStub = (arg) => {
                    return getErrorColor(`${customEmoji}  ~>${arg ? ` ${arg}` : ``}`);
                };

                expect(CustomLogger)
                    .to.exist;

                const customLoggerInstance = new CustomLogger(customEmoji);
                const consoleErrorStub = sinon.stub(console, "error");

                consoleErrorStub.returns();

                customLoggerInstance.error(errorStub);

                expect(consoleErrorStub.args[2][0])
                    .to.equal(getErrorColor(errorStub.stack));

                expect(consoleErrorStub)
                    .to.have.been.calledWith(
                        errorIdStub(),
                        errorStub
                    );

                expect(consoleErrorStub)
                    .to.have.been.calledWith(
                        errorIdStub("Stack Trace:")
                    );

                console.error.restore();
            });

            context("Graylog", () => {
                before(() => {
                    ["error", "info", "log", "warn"].forEach(method => {
                        sinon.stub(console, method);
                        console[method].returns();
                    });
                });

                after(() => {
                    ["error", "info", "log", "warn"].forEach(method => {
                        console[method].restore();
                    });
                });

                it("configures Graylog", () => {
                    const CustomLogger = proxyquire("../src/utils/logger.js", {
                        "./getWildcatConfig": () => {
                            const config = Object.assign({}, wildcatConfig);
                            wildcatConfig.serverSettings.graylog = {
                                fields: {
                                    app: "example",
                                    env: process.env.NODE_ENV || "development",
                                    loggerName: "example"
                                }
                            };

                            return config;
                        }
                    });

                    expect(CustomLogger)
                        .to.exist;

                    const customLoggerInstance = new CustomLogger(customEmoji);

                    expect(customLoggerInstance)
                        .to.be.an.instanceof(CustomLogger);

                    ["error", "info", "log", "meta", "ok", "warn"].forEach(method => {
                        expect(customLoggerInstance)
                            .to.respondTo(method);

                        const loggerResponse = customLoggerInstance[method](`logger test: ${method}`);
                        expect(loggerResponse)
                            .to.be.true;
                    });
                });

                it("gracefully handles missing Graylog configuration", () => {
                    const CustomLogger = proxyquire("../src/utils/logger.js", {
                        "./getWildcatConfig": () => {
                            const config = Object.assign({}, wildcatConfig);
                            wildcatConfig.serverSettings.graylog = {
                                fields: {}
                            };

                            return config;
                        }
                    });

                    expect(CustomLogger)
                        .to.exist;

                    const customLoggerInstance = new CustomLogger(customEmoji);

                    expect(customLoggerInstance)
                        .to.be.an.instanceof(CustomLogger);

                    ["error", "info", "log", "meta", "ok", "warn"].forEach(method => {
                        expect(customLoggerInstance)
                            .to.respondTo(method);

                        const loggerResponse = customLoggerInstance[method](`logger test: ${method}`);
                        expect(loggerResponse)
                            .to.be.true;
                    });
                });
            });
        });
    });

    context("middleware", () => {
        context("renderReactWithJspm", function () {
            this.timeout(30000);

            const nodeEnv = process.env.NODE_ENV;
            const wildcatConfig = require("../src/utils/getWildcatConfig")(exampleDir);
            const currentLogLevel = wildcatConfig.generalSettings.logLevel;
            let staticServer;

            beforeEach((done) => {
                process.env.LOG_LEVEL = 0;

                staticServer = proxyquire("../src/staticServer.js", {
                    "cluster": {
                        isMaster: false,
                        worker: {
                            id: 1
                        }
                    },
                    "./utils/getWildcatConfig": () => {
                        const config = Object.assign({}, wildcatConfig);
                        config.generalSettings.logLevel = 0;

                        return config;
                    },
                    "./utils/logger": NullConsoleLogger
                });

                staticServer.start()
                    .then(() => done());
            });

            afterEach((done) => {
                staticServer.close();

                process.env.LOG_LEVEL = currentLogLevel;
                done();
            });

            context("with asynchronous entry path", () => {
                const renderTypes = [{
                    name: "renders HTML",
                    expectation: `<title data-react-helmet="true">Index Example</title>`,
                    fresh: false,
                    url: "/"
                }, {
                    name: "renders HTML on subsequent requests",
                    expectation: `<title data-react-helmet="true">Index Example</title>`,
                    fresh: false,
                    url: "/"
                }, {
                    name: "returns error payload",
                    expectation: "Not found",
                    fresh: false,
                    url: "/error"
                }, {
                    name: "redirects the page",
                    expectation: "",
                    fresh: false,
                    url: "/redirect"
                }, {
                    name: "handles server errors",
                    error: true,
                    expectation: "Fetch error (404 Not Found) loading",
                    fresh: false,
                    url: "/"
                }];

                ["development", "production"].forEach(currentEnv => {
                    let renderReactWithJspm = require("../src/middleware/renderReactWithJspm")(exampleDir, {
                        cache: new Map(),
                        logger: {
                            error: () => {}
                        },
                        wildcatConfig
                    });

                    context(currentEnv, () => {
                        const isCurrentlyProd = (currentEnv === "production");

                        before(() => {
                            process.env.NODE_ENV = currentEnv;
                            wildcatConfig.generalSettings.logLevel = 0;
                            wildcatConfig.serverSettings.hotReloader = "react-wildcat-hot-reloader";
                            wildcatConfig.serverSettings.hotReloadReporter = isCurrentlyProd ? () => {} : false;
                            wildcatConfig.serverSettings.localPackageCache = isCurrentlyProd;
                        });

                        renderTypes.forEach((render) => {
                            it(render.name, (done) => {
                                if (render.error) {
                                    renderReactWithJspm = require("../src/middleware/renderReactWithJspm")(exampleDir, {
                                        cache: new Map(),
                                        logger: {
                                            error: () => {}
                                        },
                                        wildcatConfig: Object.assign({}, wildcatConfig, {
                                            serverSettings: {
                                                displayBlueBoxOfDeath: !isCurrentlyProd,
                                                entry: "stubEntry.js",
                                                hotReloader: false,
                                                hotReloadReporter: false,
                                                localPackageCache: isCurrentlyProd,
                                                renderHandler: "stubRenderHandler.js"
                                            }
                                        })
                                    });
                                }

                                co(function* () {
                                    return yield renderReactWithJspm.call({
                                        cookies: {
                                            get: () => "clientSize"
                                        },
                                        request: {
                                            header: {
                                                host: wildcatConfig.generalSettings.originUrl,
                                                "user-agent": "Mozilla/5.0"
                                            },
                                            fresh: render.fresh,
                                            url: render.url
                                        },
                                        redirect: () => "",
                                        response: {
                                            get: () => Date.now(),
                                            status: null,
                                            type: "text/html",
                                            lastModified: null
                                        }
                                    });
                                })
                                    .then((result) => {
                                        expect(result)
                                            .to.be.a("string");

                                        done();
                                    })
                                    .catch(e => done(e));
                            });
                        });

                        after(() => {
                            process.env.NODE_ENV = nodeEnv;
                            wildcatConfig.generalSettings.logLevel = currentLogLevel;
                        });
                    });
                });
            });

            context("with no defined entry path", () => {
                const existingEntry = wildcatConfig.serverSettings.entry;

                before(() => {
                    wildcatConfig.serverSettings.entry = false;
                    wildcatConfig.generalSettings.logLevel = 0;
                });

                it("renders HTML", (done) => {
                    const renderReactWithJspm = require("../src/middleware/renderReactWithJspm")(exampleDir, {
                        cache: new Map(),
                        logger: {
                            error: () => {}
                        },
                        wildcatConfig
                    });

                    co(function* () {
                        try {
                            const result = yield renderReactWithJspm.call({
                                cookies: {
                                    get: () => "clientSize"
                                },
                                request: {
                                    header: {
                                        host: wildcatConfig.generalSettings.originUrl,
                                        "user-agent": "Mozilla/5.0"
                                    },
                                    fresh: false,
                                    url: "/"
                                },
                                redirect: () => "",
                                response: {
                                    get: () => Date.now(),
                                    status: null,
                                    type: null,
                                    lastModified: null
                                }
                            });

                            return result;
                        } catch (e) {
                            return Promise.reject(e);
                        }
                    })
                        .then((result) => {
                            expect(result)
                                .to.be.a("string");

                            done();
                        })
                        .catch(e => done(e));
                });

                after(() => {
                    wildcatConfig.serverSettings.entry = existingEntry;
                    wildcatConfig.generalSettings.logLevel = currentLogLevel;
                });
            });
        });

        context("custom server-only middleware", () => {
            it(`starts the server and loads custom middleware`, (done) => {
                var middlewareSetup;
                const server = proxyquire("../src/server.js", {
                    "cluster": {
                        isMaster: false,
                        worker: {
                            id: 1
                        }
                    },
                    "./utils/getWildcatConfig": () => {
                        const defaultConfig = require("../src/utils/getWildcatConfig")();
                        defaultConfig.serverSettings.appServer.middleware = [
                            (app, wildcatConfig) => {
                                middlewareSetup = {
                                    app,
                                    wildcatConfig
                                };
                            }
                        ];

                        return defaultConfig;
                    },
                    "./utils/logger": NullConsoleLogger
                });

                server.start()
                    .then(() => {
                        expect(middlewareSetup)
                            .to.exist;

                        expect(middlewareSetup.app)
                            .to.be.an("object");

                        expect(middlewareSetup.app).to.be.instanceof(require('koa'));

                        expect(middlewareSetup.wildcatConfig).to.exist;

                        server.close();
                        done();
                    });
            });

            it(`starts the server and loads incorrectly formed middleware`, (done) => {
                var loggerErrorMessages = [];
                const server = proxyquire("../src/server.js", {
                    "cluster": {
                        isMaster: false,
                        worker: {
                            id: 1
                        }
                    },
                    "./utils/getWildcatConfig": () => {
                        const defaultConfig = require("../src/utils/getWildcatConfig")();
                        defaultConfig.serverSettings.appServer.middleware = [
                            "this is a bad middleware function"
                        ];

                        return defaultConfig;
                    },
                    "./utils/logger": (() => {
                        function Logger() {}

                        Logger.prototype = {
                            info: () => {},
                            meta: () => {},
                            ok: () => {},
                            warn: () => {},
                            error: (msg) => loggerErrorMessages.push(msg)
                        };

                        return Logger;
                    })()
                });

                var doneDone = (err) => {
                    try {
                        server.close();
                    } catch (error) {
                        console.log("Error shutting down test server");
                        console.log(error);
                    }

                    if (err) {
                        return done(err);
                    }
                    return done();
                };

                server.start()
                    .then(() => {
                        try {
                            expect(loggerErrorMessages.length).to.equal(1);

                            expect(loggerErrorMessages[0]).to.contain("Middleware at serverSettings.appServer.middleware[0] could not be correclty initialized.");

                            doneDone();
                        } catch (error) {
                            doneDone(error);
                        }
                    }, doneDone);
            });
        });
    });

    context("cluster", ()=> {
        context("When attempting to start a cluster of app servers", function () {
            this.timeout(30000);

            let clusterForkStub;
            let server;
            beforeEach(() => {
                clusterForkStub = sinon.stub(cluster, 'fork');
            });

            afterEach(() => {
                clusterForkStub.restore();
                server && server.close && server.close();
            });

            it(`maxClusterCpuCount defined as 1 should only start one server`, (done) => {
                server = proxyquire("../src/server.js", {
                    "./utils/getWildcatConfig": () => {
                        const defaultConfig = require("../src/utils/getWildcatConfig")();
                        defaultConfig.serverSettings.appServer.maxClusterCpuCount = 1;
                        return defaultConfig;
                    },
                    "./utils/logger": NullConsoleLogger
                });

                server.start()
                    .then(result => {
                        expect(result.clusterForksCount).to.equal(1);

                        sinon.assert.callCount(clusterForkStub, 1);

                        done();
                    }, done);
            });

            it(`maxClusterCpuCount=2 should start 2 servers`, (done) => {
                server = proxyquire("../src/server.js", {
                    "./utils/getWildcatConfig": () => {
                        const defaultConfig = require("../src/utils/getWildcatConfig")();
                        defaultConfig.serverSettings.appServer.maxClusterCpuCount = 2;

                        defaultConfig.__ClusterServerTest__ = true;

                        return defaultConfig;
                    },
                    "./utils/logger": NullConsoleLogger
                });

                server.start()
                    .then(result => {
                        expect(result.clusterForksCount).to.equal(2);

                        sinon.assert.callCount(clusterForkStub, 2);
                    })
                    .then(done, done);
            });


            it(`maxClusterCpuCount defined as Infinity should start as many servers as machine CPUs`, (done) => {
                server = proxyquire("../src/server.js", {
                    "./utils/getWildcatConfig": () => {
                        const defaultConfig = require("../src/utils/getWildcatConfig")();
                        defaultConfig.serverSettings.appServer.maxClusterCpuCount = Infinity;
                        defaultConfig.__ClusterServerTest__ = true;
                        return defaultConfig;
                    },
                    "./utils/logger": NullConsoleLogger
                });

                server.start()
                    .then(result => {
                        expect(result.clusterForksCount).to.equal(os.cpus().length);

                        sinon.assert.callCount(clusterForkStub, os.cpus().length);

                        done();
                    }, done);
            });
        });
    });

    context("app server", () => {
        const nodeEnv = process.env.NODE_ENV;

        const expectations = {
            "development": [
                "Proxy",
                "Node server is running at"
            ],
            "production": [
                "Node server is running"
            ],
            "production-with-proxies": [
                "Proxy",
                "Node server is running"
            ]
        };

        Object.keys(expectations).forEach(currentEnv => {
            context(currentEnv, () => {
                before(() => {
                    if (currentEnv === "production-with-proxies") {
                        process.env.DANGEROUSLY_ENABLE_PROXIES_IN_PRODUCTION = "true";
                        process.env.NODE_ENV = "production";
                    } else {
                        process.env.NODE_ENV = currentEnv;
                    }
                });

                it("starts the server via cli", (done) => {
                    const currentExpectations = expectations[currentEnv];
                    let currentExpectationCount = 0;
                    let cli;

                    try {
                        cli = cp.spawn("node", [
                            path.join(cwd, "packages/react-wildcat/cli/wildcat.js")
                        ], {
                            stdio: "pipe"
                        });

                        cli.stdout.setEncoding("utf8");

                        cli.stdout.on("data", (data) => {
                            const expectationMatch = currentExpectations.some(exp => data.includes(exp));

                            if (expectationMatch) {
                                expect(expectationMatch).to.be.true;
                                currentExpectationCount++;
                            }

                            expect(cli.killed)
                                .to.be.false;

                            if (currentExpectationCount >= currentExpectations.length) {
                                cli.kill("SIGINT");

                                expect(cli.killed)
                                    .to.be.true;

                                setTimeout(() => done(), 250);
                            }
                        });
                    } catch (e) {
                        cli && cli.kill && cli.kill("SIGINT");
                        done(e);
                    }
                });

                ["http2", "https", "http"].forEach(currentProtocol => {
                    it(`starts the server programmatically using ${currentProtocol}`, (done) => {
                        const server = proxyquire("../src/server.js", {
                            "cluster": {
                                isMaster: false,
                                worker: {
                                    id: 1
                                }
                            },
                            "./utils/getWildcatConfig": () => {
                                const defaultConfig = require("../src/utils/getWildcatConfig")();
                                defaultConfig.serverSettings.appServer.protocol = currentProtocol;

                                return defaultConfig;
                            },
                            "./utils/logger": NullConsoleLogger
                        });

                        expect(server)
                            .to.exist;

                        expect(server)
                            .to.respondTo("start");

                        expect(server.start)
                            .to.be.a("function");

                        server.start()
                            .then((result) => {
                                expect(result)
                                    .to.exist;

                                expect(result)
                                    .to.be.an("object")
                                    .that.has.property("env")
                                    .that.equals(process.env.NODE_ENV);

                                server.close();
                                done();
                            });
                    });
                });

                after(() => {
                    if (currentEnv === "production-with-debug") {
                        process.env.DEBUG = undefined;
                    }

                    process.env.NODE_ENV = nodeEnv;
                });
            });
        });

        context("lifecycle events", () => {
            const lifecycleTests = [
                "onBeforeStart",
                "onWorkerStart",
                "onStart",
                "onAfterStart"
            ];

            lifecycleTests.forEach(lifecycle => {
                it(lifecycle, (done) => {
                    const wildcatConfig = require("../src/utils/getWildcatConfig")();
                    const appServerSettings = wildcatConfig.serverSettings.appServer;
                    appServerSettings[lifecycle] = sinon.spy();

                    const server = proxyquire("../src/server.js", {
                        "cluster": {
                            isMaster: false,
                            worker: {
                                id: 1
                            }
                        },
                        "./utils/getWildcatConfig": () => wildcatConfig,
                        "./utils/logger": NullConsoleLogger
                    });

                    expect(server)
                        .to.exist;

                    expect(server)
                        .to.respondTo("start");

                    expect(server.start)
                        .to.be.a("function");

                    server.start()
                        .then((result) => {
                            expect(result)
                                .to.exist;

                            expect(result)
                                .to.be.an("object")
                                .that.has.property("env")
                                .that.equals(process.env.NODE_ENV);

                            expect(appServerSettings[lifecycle].calledOnce)
                                .to.be.true;

                            server.close();
                            done();
                        })
                        .catch(err => {
                            server.close();
                            done(err);
                        });
                });
            });
        });
    });

    after(() => {
        process.chdir(cwd);
    });
});
