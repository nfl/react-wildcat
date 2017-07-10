const fs = require("fs-extra");
const cp = require("child_process");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

const cwd = process.cwd();
const path = require("path");
const os = require("os");

const cluster = require("cluster");

describe("staticServer", () => {
    const mockStubs = require("./fixtures");

    beforeAll(() => {
        [mockStubs.publicDir].forEach(fs.removeSync);

        process.chdir(mockStubs.exampleDir);
    });

    describe("middleware", () => {
        require("./middleware/webpackHotMiddlewareSpec.js")(mockStubs);
    });

    describe("static server", () => {
        const expectations = {
            development: ["Static server is running at"],
            production: ["Static server is running"]
        };

        ["development", "production"].forEach(mockCurrentEnv => {
            describe(mockCurrentEnv, () => {
                beforeAll(() => {
                    jest.resetModules();

                    jest.mock("../src/utils/logger");

                    sinon.stub(console, "info").returns();
                    sinon.stub(mockStubs.logger, "info").returns();
                });

                afterAll(() => {
                    jest.unmock("cluster");
                    jest.unmock("../src/utils/getWildcatConfig");
                    jest.unmock("../src/memory.js");
                    jest.unmock("../src/utils/logger.js");

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
                                    "packages/react-wildcat/cli/wildcatStaticServer.js"
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

                ["http2", "https", "http"].forEach(mockCurrentProtocol => {
                    describe(mockCurrentProtocol, () => {
                        it("starts the server programmatically", done => {
                            jest.mock("cluster", () => {
                                const cluster = jest.genMockFromModule(
                                    "cluster"
                                );

                                cluster.isMaster = false;
                                cluster.worker = {
                                    id: 1
                                };

                                return cluster;
                            });

                            jest.mock("../src/utils/getWildcatConfig", () => {
                                const defaultConfig = require("../src/config/wildcat.config.js");
                                const deepmerge = require("deepmerge");

                                return function() {
                                    return deepmerge.all([
                                        defaultConfig,
                                        mockStubs.getEnvironment({
                                            NODE_ENV: mockCurrentEnv
                                        }),
                                        {
                                            clientSettings: {
                                                webpackDevSettings: `config/webpack/${mockCurrentEnv}.client.config.js`
                                            },
                                            serverSettings: {
                                                staticServer: {
                                                    minClusterCpuCount: 1,
                                                    maxClusterCpuCount: 1,
                                                    protocol: mockCurrentProtocol
                                                }
                                            }
                                        }
                                    ]);
                                };
                            });

                            const staticServer = require("../src/staticServer.js");

                            expect(staticServer).to.exist;

                            expect(staticServer).to.respondTo("start");

                            expect(staticServer.start).to.be.a("function");

                            staticServer
                                .start()
                                .then(result => {
                                    expect(result).to.exist;

                                    expect(result).to.be
                                        .an("object")
                                        .that.has.property("env")
                                        .that.equals(mockCurrentEnv);

                                    staticServer.close();
                                    done();
                                })
                                .catch(err => {
                                    staticServer.close();
                                    done(err);
                                });
                        });
                    });
                });
            });
        });

        describe("lifecycle events", () => {
            const lifecycleTests = [
                "onBeforeStart",
                "onWorkerStart",
                "onStart",
                "onAfterStart"
            ];

            lifecycleTests.forEach(mockLifecycle => {
                it(mockLifecycle, done => {
                    const mockLifecycleSpy = sinon.spy();

                    jest.mock("cluster", () => {
                        const cluster = jest.genMockFromModule("cluster");

                        cluster.isMaster = false;
                        cluster.worker = {
                            id: 1
                        };

                        return cluster;
                    });

                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        const deepmerge = require("deepmerge");

                        return function() {
                            return deepmerge.all([
                                defaultConfig,
                                {
                                    serverSettings: {
                                        staticServer: {
                                            [mockLifecycle]: mockLifecycleSpy
                                        }
                                    }
                                }
                            ]);
                        };
                    });

                    const server = require("../src/staticServer.js");

                    expect(server).to.exist;

                    expect(server).to.respondTo("start");

                    expect(server.start).to.be.a("function");

                    server
                        .start()
                        .then(result => {
                            expect(result).to.exist;

                            expect(mockLifecycleSpy.calledOnce);

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

        describe("cluster", () => {
            describe("When attempting to start a cluster of static servers", function() {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
                let mockClusterForkSpy;

                let server;

                beforeEach(() => {
                    jest.resetModules();
                    mockClusterForkSpy = sinon.spy();
                });

                afterEach(() => {
                    jest.unmock("../src/utils/getWildcatConfig");
                    mockClusterForkSpy.reset();

                    server && server.close && server.close();
                });

                it(`maxClusterCpuCount defined as 1 should only start one server`, function(
                    done
                ) {
                    jest.mock("cluster", () => {
                        const cluster = jest.genMockFromModule("cluster");

                        cluster.isMaster = true;
                        cluster.worker = {
                            id: 1
                        };

                        cluster.fork = mockClusterForkSpy;

                        return cluster;
                    });

                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const deepmerge = require("deepmerge");
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        return function() {
                            return deepmerge.all([
                                defaultConfig,
                                {
                                    __ClusterServerTest__: true,
                                    serverSettings: {
                                        staticServer: {
                                            maxClusterCpuCount: 1
                                        }
                                    }
                                }
                            ]);
                        };
                    });

                    server = require("../src/staticServer.js");

                    server.start().then(result => {
                        expect(result.clusterForksCount).to.equal(1);
                        expect(cluster.fork.calledOnce);

                        done();
                    }, done);
                });

                it(`maxClusterCpuCount=2 should start 2 servers`, function(
                    done
                ) {
                    jest.mock("cluster", () => {
                        const cluster = jest.genMockFromModule("cluster");

                        cluster.isMaster = true;
                        cluster.worker = {
                            id: 1
                        };

                        cluster.fork = mockClusterForkSpy;

                        return cluster;
                    });

                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const deepmerge = require("deepmerge");
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        return function() {
                            return deepmerge.all([
                                defaultConfig,
                                {
                                    __ClusterServerTest__: true,
                                    serverSettings: {
                                        staticServer: {
                                            maxClusterCpuCount: 2
                                        }
                                    }
                                }
                            ]);
                        };
                    });

                    server = require("../src/staticServer.js");

                    server
                        .start()
                        .then(result => {
                            expect(result.clusterForksCount).to.equal(2);
                            expect(cluster.fork.calledTwice);
                        })
                        .then(done)
                        .catch(done);
                });

                it(`maxClusterCpuCount defined as Infinity should start as many servers as machine CPUs`, done => {
                    jest.mock("cluster", () => {
                        const cluster = jest.genMockFromModule("cluster");

                        cluster.isMaster = true;
                        cluster.worker = {
                            id: 1
                        };

                        cluster.fork = mockClusterForkSpy;

                        return cluster;
                    });

                    jest.mock("../src/utils/getWildcatConfig", () => {
                        const deepmerge = require("deepmerge");
                        const defaultConfig = require("../src/config/wildcat.config.js");
                        return function() {
                            return deepmerge.all([
                                defaultConfig,
                                {
                                    __ClusterServerTest__: true,
                                    serverSettings: {
                                        staticServer: {
                                            maxClusterCpuCount: Infinity
                                        }
                                    }
                                }
                            ]);
                        };
                    });

                    server = require("../src/staticServer.js");

                    server
                        .start()
                        .then(result => {
                            expect(result.clusterForksCount).to.equal(
                                os.cpus().length
                            );
                            expect(mockClusterForkSpy.callCount).to.equal(
                                os.cpus().length
                            );

                            done();
                        })
                        .catch(done);
                });
            });
        });
    });

    afterAll(() => {
        process.chdir(cwd);
    });
});
