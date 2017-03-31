const fs = require("fs-extra");
const cp = require("child_process");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

const cwd = process.cwd();
const path = require("path");
const os = require("os");

const cluster = require("cluster");
const deepmerge = require("deepmerge");
const proxyquire = require("proxyquire");

describe("staticServer", () => {
    const stubs = require("./fixtures");

    before(() => {
        [
            stubs.publicDir
        ].forEach(fs.removeSync);

        process.chdir(stubs.exampleDir);
    });

    context("middleware", () => {
        require("./middleware/webpackHotMiddlewareSpec.js")(stubs);
    });

    context("static server", () => {
        const expectations = {
            "development": [
                "Static server is running at"
            ],
            "production": [
                "Static server is running"
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

        ["development", "production"].forEach(currentEnv => {
            context(currentEnv, () => {
                it("starts the server via cli", (done) => {
                    const currentExpectations = expectations[currentEnv];
                    let currentExpectationCount = 0;
                    let cli;

                    try {
                        cli = cp.spawn("node", [
                            path.join(cwd, "packages/react-wildcat/cli/wildcatStaticServer.js")
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
                    context(currentProtocol, () => {
                        it("starts the server programmatically", (done) => {
                            const staticServer = proxyquire("../src/staticServer.js", {
                                "cluster": {
                                    isMaster: false,
                                    worker: {
                                        id: 1
                                    }
                                },
                                "./utils/getWildcatConfig": () => {
                                    const defaultConfig = require("../src/utils/getWildcatConfig")();
                                    return deepmerge.all([
                                        defaultConfig,
                                        stubs.getEnvironment({
                                            NODE_ENV: currentEnv
                                        }),
                                        {
                                            serverSettings: {
                                                staticServer: {
                                                    minClusterCpuCount: 1,
                                                    maxClusterCpuCount: 1,
                                                    protocol: currentProtocol
                                                }
                                            }
                                        }
                                    ]);
                                },
                                "./utils/logger": (() => {
                                    function Logger() {}

                                    Logger.prototype = {
                                        info: () => {},
                                        meta: () => {},
                                        ok: () => {},
                                        warn: () => {}
                                    };

                                    return Logger;
                                })()
                            });

                            expect(staticServer)
                                .to.exist;

                            expect(staticServer)
                                .to.respondTo("start");

                            expect(staticServer.start)
                                .to.be.a("function");

                            staticServer.start()
                                .then((result) => {
                                    expect(result)
                                        .to.exist;

                                    expect(result)
                                        .to.be.an("object")
                                        .that.has.property("env")
                                        .that.equals(currentEnv);

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

        context("lifecycle events", () => {
            const lifecycleTests = [
                "onBeforeStart",
                "onWorkerStart",
                "onStart",
                "onAfterStart"
            ];

            lifecycleTests.forEach(lifecycle => {
                let wildcatConfig = require("../src/utils/getWildcatConfig")();

                it(lifecycle, (done) => {
                    const server = proxyquire("../src/staticServer.js", {
                        "cluster": {
                            isMaster: false,
                            worker: {
                                id: 1
                            }
                        },
                        "./utils/getWildcatConfig": () => {
                            wildcatConfig = deepmerge.all([
                                wildcatConfig,
                                {
                                    serverSettings: {
                                        staticServer: {
                                            [lifecycle]: sinon.spy()
                                        }
                                    }
                                }
                            ]);

                            return wildcatConfig;
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

                            expect(wildcatConfig.serverSettings.staticServer[lifecycle].calledOnce)
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
            context("When attempting to start a cluster of static servers", function () {
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
                    server = proxyquire("../src/staticServer.js", {
                        "./utils/getWildcatConfig": () => {
                            const defaultConfig = require("../src/utils/getWildcatConfig")();
                            return deepmerge.all([
                                defaultConfig,
                                {
                                    serverSettings: {
                                        staticServer: {
                                            maxClusterCpuCount: 1
                                        }
                                    }
                                }
                            ]);
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
                    server = proxyquire("../src/staticServer.js", {
                        "./utils/getWildcatConfig": () => {
                            const defaultConfig = require("../src/utils/getWildcatConfig")();
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
                        },
                        "./utils/logger": stubs.NullConsoleLogger
                    });

                    server.start()
                        .then(result => {
                            expect(result.clusterForksCount).to.equal(2);
                            sinon.assert.callCount(clusterForkStub, 2);
                        })
                        .then(done)
                        .catch(done);
                });


                it(`maxClusterCpuCount defined as Infinity should start as many servers as machine CPUs`, (done) => {
                    server = proxyquire("../src/staticServer.js", {
                        "./utils/getWildcatConfig": () => {
                            const defaultConfig = require("../src/utils/getWildcatConfig")();
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
                        },
                        "./utils/logger": stubs.NullConsoleLogger
                    });

                    server.start()
                        .then(result => {
                            expect(result.clusterForksCount).to.equal(os.cpus().length);
                            sinon.assert.callCount(clusterForkStub, os.cpus().length);

                            done();
                        })
                        .catch(done);
                });
            });
        });
    });

    after(() => {
        process.chdir(cwd);
    });
});
