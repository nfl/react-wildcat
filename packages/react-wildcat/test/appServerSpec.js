const fs = require("fs-extra");
const cp = require("child_process");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const cwd = process.cwd();
const path = require("path");
const os = require("os");

const cluster = require("cluster");
const proxyquire = require("proxyquire");

describe("appServer", () => {
    const stubs = require("./fixtures");

    before(() => {
        [
            stubs.binDir,
            stubs.publicDir
        ].forEach(fs.removeSync);

        process.chdir(stubs.exampleDir);
    });

    context("utils", () => {
        require("./utils/blueBoxOfDeathSpec.js")(stubs);
        require("./utils/customMorganTokensSpec.js")(stubs);
        require("./utils/getMorganOptionsSpec.js")(stubs);
        require("./utils/getWildcatConfigSpec.js")(stubs);
        require("./utils/loggerSpec.js")(stubs);
    });

    context("middleware", () => {
        require("./middleware/renderReactWithWebpackSpec.js")(stubs);
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

        before(() => {
            sinon.stub(console, "info").returns();
            sinon.stub(stubs.logger, "info").returns();
        });

        after(() => {
            console.info.restore();
            stubs.logger.info.restore();
        });

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

                it(`starts the server in debug mode when env DEBUG=wildcat`, (done) => {
                    process.env.DEBUG = "wildcat";
                    const memorySpy = sinon.spy();

                    const server = proxyquire("../src/server.js", {
                        "cluster": {
                            isMaster: false,
                            worker: {
                                id: 1
                            }
                        },
                        "./memory": memorySpy
                    });

                    server.start()
                        .then((result) => {
                            expect(result)
                                .to.exist;

                            expect(result)
                                .to.be.an("object")
                                .that.has.property("env")
                                .that.equals(process.env.NODE_ENV);

                            expect(memorySpy.called);

                            server.close();
                            delete process.env.DEBUG;
                            done();
                        });
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
                            "./utils/logger": stubs.NullConsoleLogger
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

        context("server-only middleware", () => {
            it(`starts the server and loads custom middleware`, (done) => {
                let middlewareSetup;

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
                    "./utils/logger": stubs.NullConsoleLogger
                });

                server.start()
                    .then(() => {
                        expect(middlewareSetup)
                            .to.exist;

                        expect(middlewareSetup.app)
                            .to.be.an("object");

                        expect(middlewareSetup.app).to.be.instanceof(require("koa"));

                        expect(middlewareSetup.wildcatConfig).to.exist;

                        server.close();
                        done();
                    });
            });

            it(`starts the server and loads incorrectly formed middleware`, (done) => {
                const loggerErrorMessages = [];
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
                            "this is a bad middleware function",
                            null
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

                const doneDone = (err) => {
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
                            expect(loggerErrorMessages.length).to.equal(2);

                            expect(loggerErrorMessages[0])
                                .to.contain("Middleware at serverSettings.appServer.middleware[0] could not be correclty initialized.")
                                .and.to.contain("this is a bad middleware function");

                            expect(loggerErrorMessages[1])
                                .to.contain("Middleware at serverSettings.appServer.middleware[1] could not be correclty initialized.");

                            doneDone();
                        } catch (error) {
                            doneDone(error);
                        }
                    }, doneDone);
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
                        "./utils/logger": stubs.NullConsoleLogger
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

        context("cluster", () => {
            context("When attempting to start a cluster of app servers", function () {
                this.timeout(30000);

                let clusterForkStub;
                let server;

                beforeEach(() => {
                    clusterForkStub = sinon.stub(cluster, "fork");
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
                        "./utils/logger": stubs.NullConsoleLogger
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
                        "./utils/logger": stubs.NullConsoleLogger
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
                        "./utils/logger": stubs.NullConsoleLogger
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
    });

    after(() => {
        [
            stubs.binDir,
            stubs.publicDir
        ].forEach(fs.removeSync);

        process.chdir(cwd);
    });
});
