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
const asyncTestErrorHandler = require("../../../test/utils.js");

describe("appServer", () => {
    const mockStubs = require("./fixtures");

    beforeAll(() => {
        [mockStubs.publicDir].forEach(fs.removeSync);

        process.chdir(mockStubs.exampleDir);
    });

    describe("utils", () => {
        require("./utils/blueBoxOfDeathSpec.js")(mockStubs);
        require("./utils/customMorganTokensSpec.js")(mockStubs);
        require("./utils/getMorganOptionsSpec.js")(mockStubs);
        require("./utils/getWildcatConfigSpec.js")(mockStubs);
        require("./utils/loggerSpec.js")(mockStubs);
        require("./utils/webpackBundleValidationSpec.js")(mockStubs);
    });

    describe("middleware", () => {
        require("./middleware/renderReactWithWebpackSpec.js")(mockStubs);
    });

    describe("app server", () => {
        const expectations = {
            development: ["Proxy", "Node server is running at"],
            production: ["Node server is running"]
        };

        Object.keys(expectations).forEach(mockCurrentEnv => {
            describe(mockCurrentEnv, () => {
                beforeEach(() => {
                    jest.resetModules();

                    sinon.stub(console, "info").returns();
                    sinon.stub(mockStubs.logger, "info").returns();
                });

                afterEach(() => {
                    jest.unmock("cluster");
                    jest.unmock("../src/utils/getWildcatConfig");
                    jest.unmock("../src/memory.js");

                    console.info.restore();
                    mockStubs.logger.info.restore();
                });

                it("starts the server via cli", done => {
                    const currentExpectations = expectations[mockCurrentEnv];
                    let currentExpectationCount = 0;
                    let cli;

                    try {
                        cli = cp.spawn(
                            "node",
                            [
                                path.join(
                                    cwd,
                                    "packages/react-wildcat/cli/wildcat.js"
                                )
                            ],
                            {
                                stdio: "pipe"
                            }
                        );

                        cli.stdout.setEncoding("utf8");

                        cli.stdout.on("data", data => {
                            const expectationMatch = currentExpectations.some(
                                exp => data.includes(exp)
                            );

                            if (expectationMatch) {
                                expect(expectationMatch).to.be.true;
                                currentExpectationCount++;
                            }

                            expect(cli.killed).to.be.false;

                            if (
                                currentExpectationCount >=
                                currentExpectations.length
                            ) {
                                cli.kill("SIGINT");

                                expect(cli.killed).to.be.true;

                                setTimeout(() => done(), 250);
                            }
                        });
                    } catch (e) {
                        cli && cli.kill && cli.kill("SIGINT");
                        done(e);
                    }
                });

                it(`starts the server in debug mode when env DEBUG=wildcat`, done => {
                    const mockMemorySpy = sinon.spy();

                    jest.mock("cluster", () => {
                        return {
                            isMaster: false,
                            worker: {
                                id: 1
                            }
                        };
                    });

                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const deepmerge = require("deepmerge");
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        return function () {
                            return deepmerge.all([
                                defaultConfig,
                                mockStubs.getEnvironment({
                                    DEBUG: "wildcat",
                                    NODE_ENV: mockCurrentEnv
                                }),
                                {
                                    generalSettings: {
                                        originUrl: "localhost"
                                    },
                                    serverSettings: {
                                        webpackDevSettings: `config/webpack/${mockCurrentEnv}.server.config.js`,
                                        appServer: {
                                            minClusterCpuCount: 1,
                                            maxClusterCpuCount: 1
                                        }
                                    }
                                }
                            ]);
                        };
                    });

                    jest.mock("../src/memory.js", () => {
                        return mockMemorySpy;
                    });

                    const server = require("../src/server.js");

                    server
                        .start()
                        .then(result => {
                            expect(result).to.exist;

                            expect(result).to.be
                                .an("object")
                                .that.has.property("env")
                                .that.equals(mockCurrentEnv);

                            expect(mockMemorySpy.called);

                            server.close();
                            done();
                        })
                        .catch(e => {
                            server.close();
                            asyncTestErrorHandler(e, done);
                        });
                });

                ["http2", "https", "http"].forEach(mockCurrentProtocol => {
                    it(`starts the server programmatically using ${mockCurrentProtocol}`, done => {
                        jest.mock("cluster", () => {
                            return {
                                isMaster: false,
                                worker: {
                                    id: 1
                                }
                            };
                        });

                        jest.mock("../src/utils/getWildcatConfig", () => {
                            const deepmerge = require("deepmerge");
                            const defaultConfig = require("../src/config/wildcat.config.js");
                            return function () {
                                return deepmerge.all([
                                    defaultConfig,
                                    mockStubs.getEnvironment({
                                        NODE_ENV: mockCurrentEnv
                                    }),
                                    {
                                        serverSettings: {
                                            webpackDevSettings: `config/webpack/${mockCurrentEnv}.server.config.js`,
                                            appServer: {
                                                maxClusterCpuCount: 1,
                                                minClusterCpuCount: 1,
                                                protocol: mockCurrentProtocol
                                            }
                                        }
                                    }
                                ]);
                            };
                        });

                        jest.mock("../src/utils/logger.js");

                        const server = require("../src/server.js");

                        expect(server).to.exist;

                        expect(server).to.respondTo("start");

                        expect(server.start).to.be.a("function");

                        server
                            .start()
                            .then(result => {
                                expect(result).to.exist;

                                expect(result).to.be
                                    .an("object")
                                    .that.has.property("env")
                                    .that.equals(mockCurrentEnv);

                                server.close();
                                done();
                            })
                            .catch(e => {
                                server.close();
                                asyncTestErrorHandler(e, done);
                            });
                    });
                });
            });
        });

        describe("server-only middleware", () => {
            beforeEach(() => {
                jest.resetModules();
            });

            afterEach(() => {
                jest.unmock("cluster");
                jest.unmock("../src/utils/getWildcatConfig");
                jest.unmock("../src/utils/logger.js");
            });

            it(`starts the server and loads custom middleware`, done => {
                let mockMiddlewareSetup;

                jest.mock("cluster", () => {
                    return {
                        isMaster: false,
                        worker: {
                            id: 1
                        }
                    };
                });

                jest.mock("../src/utils/getWildcatConfig", () => {
                    const defaultConfig = require("../src/config/wildcat.config.js");
                    return function () {
                        defaultConfig.serverSettings.appServer.middleware = [
                            (app, wildcatConfig) => {
                                mockMiddlewareSetup = {
                                    app,
                                    wildcatConfig
                                };
                            }
                        ];
                        return defaultConfig;
                    };
                });

                jest.mock("../src/utils/logger.js");

                const server = require("../src/server.js");

                server
                    .start()
                    .then(() => {
                        expect(mockMiddlewareSetup).to.exist;

                        expect(mockMiddlewareSetup.app).to.be.an("object");

                        expect(mockMiddlewareSetup.app).to.be.instanceof(
                            require("koa")
                        );

                        expect(mockMiddlewareSetup.wildcatConfig).to.exist;

                        server.close();
                        done();
                    })
                    .catch(e => {
                        server.close();
                        asyncTestErrorHandler(e, done);
                    });
            });

            it(`starts the server and loads incorrectly formed middleware`, done => {
                const mockLoggerErrorMessages = [];

                jest.mock("cluster", () => {
                    return {
                        isMaster: false,
                        worker: {
                            id: 1
                        }
                    };
                });

                jest.mock("../src/utils/getWildcatConfig", () => {
                    const defaultConfig = require("../src/config/wildcat.config.js");
                    return function () {
                        defaultConfig.serverSettings.appServer.middleware = [
                            "this is a bad middleware function",
                            null
                        ];
                        return defaultConfig;
                    };
                });

                jest.mock("../src/utils/logger.js", () => {
                    function Logger() {}

                    Logger.prototype = {
                        info: () => {},
                        meta: () => {},
                        ok: () => {},
                        warn: () => {},
                        error: msg => mockLoggerErrorMessages.push(msg)
                    };

                    return Logger;
                });

                const server = require("../src/server.js");

                const doneDone = err => {
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

                server
                    .start()
                    .then(() => {
                        try {
                            expect(mockLoggerErrorMessages.length).to.equal(2);

                            expect(mockLoggerErrorMessages[0]).to
                                .contain(
                                    "Middleware at serverSettings.appServer.middleware[0] could not be correclty initialized."
                                )
                                .and.to.contain(
                                    "this is a bad middleware function"
                                );

                            expect(mockLoggerErrorMessages[1]).to.contain(
                                "Middleware at serverSettings.appServer.middleware[1] could not be correclty initialized."
                            );

                            doneDone();
                        } catch (error) {
                            doneDone(error);
                        }
                    })
                    .catch(e => {
                        server.close();
                        asyncTestErrorHandler(e, done);
                    });
            });
        });

        describe("lifecycle events", () => {
            beforeEach(() => {
                jest.resetModules();
            });

            afterEach(() => {
                jest.unmock("cluster");
                jest.unmock("../src/utils/getWildcatConfig");
                jest.unmock("../src/utils/logger.js");
            });

            const lifecycleTests = [
                "onBeforeStart",
                "onWorkerStart",
                "onStart",
                "onAfterStart"
            ];

            lifecycleTests.forEach(lifecycle => {
                it(lifecycle, done => {
                    const wildcatConfig = require("../src/utils/getWildcatConfig")();
                    const appServerSettings =
                        wildcatConfig.serverSettings.appServer;
                    appServerSettings[lifecycle] = sinon.spy();

                    jest.mock("cluster", () => {
                        return {
                            isMaster: false,
                            worker: {
                                id: 1
                            }
                        };
                    });

                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        return function () {
                            return defaultConfig;
                        };
                    });

                    jest.mock("../src/utils/logger.js");

                    const server = require("../src/server.js");

                    expect(server).to.exist;

                    expect(server).to.respondTo("start");

                    expect(server.start).to.be.a("function");

                    server
                        .start()
                        .then(result => {
                            expect(result).to.exist;

                            expect(appServerSettings[lifecycle].calledOnce).to
                                .be.true;

                            server.close();
                            done();
                        })
                        .catch(e => {
                            server.close();
                            asyncTestErrorHandler(e, done);
                        });
                });
            });
        });

        describe("cluster", () => {
            describe("When attempting to start a cluster of app servers", () => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

                let clusterForkStub;
                let server;

                beforeEach(() => {
                    jest.resetModules();
                    clusterForkStub = sinon.stub(cluster, "fork");
                });

                afterEach(() => {
                    clusterForkStub.restore();
                    server && server.close && server.close();

                    jest.unmock("../src/utils/getWildcatConfig");
                    jest.unmock("../src/utils/logger.js");
                });

                it(`maxClusterCpuCount defined as 1 should only start one server`, done => {
                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        return function () {
                            defaultConfig.serverSettings.appServer.maxClusterCpuCount = 1;
                            return defaultConfig;
                        };
                    });

                    jest.mock("../src/utils/logger.js");

                    server = require("../src/server.js");

                    server
                        .start()
                        .then(result => {
                            expect(result.clusterForksCount).to.equal(1);

                            sinon.assert.callCount(clusterForkStub, 1);

                            done();
                        })
                        .catch(e => asyncTestErrorHandler(e, done));
                });

                it(`maxClusterCpuCount=2 should start 2 servers`, done => {
                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        return function () {
                            defaultConfig.serverSettings.appServer.maxClusterCpuCount = 2;
                            defaultConfig.__ClusterServerTest__ = true;
                            return defaultConfig;
                        };
                    });

                    jest.mock("../src/utils/logger.js");

                    server = require("../src/server.js");

                    server
                        .start()
                        .then(result => {
                            expect(result.clusterForksCount).to.equal(2);

                            sinon.assert.callCount(clusterForkStub, 2);
                            done();
                        })
                        .catch(e => asyncTestErrorHandler(e, done));
                });

                it(`maxClusterCpuCount defined as Infinity should start as many servers as machine CPUs`, done => {
                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        return function () {
                            defaultConfig.serverSettings.appServer.maxClusterCpuCount = Infinity;
                            defaultConfig.__ClusterServerTest__ = true;
                            return defaultConfig;
                        };
                    });

                    jest.mock("../src/utils/logger.js");

                    server = require("../src/server.js");

                    server
                        .start()
                        .then(result => {
                            expect(result.clusterForksCount).to.equal(
                                os.cpus().length
                            );

                            sinon.assert.callCount(
                                clusterForkStub,
                                os.cpus().length
                            );

                            done();
                        })
                        .catch(e => asyncTestErrorHandler(e, done));
                });
            });
        });
    });

    afterAll(() => {
        [mockStubs.publicDir].forEach(fs.removeSync);

        process.chdir(cwd);
    });
});
