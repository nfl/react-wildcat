"use strict";

const fs = require("fs-extra");
const cp = require("child_process");
const co = require("co");

const chai = require("chai");
const expect = chai.expect;

const cwd = process.cwd();
const path = require("path");
const pathExists = require("path-exists");
// const nexpect = require("nexpect");

const proxyquire = require("proxyquire");

/* eslint-disable max-nested-callbacks */
describe("react-wildcat", () => {
    const exampleDir = path.join(cwd, "example");

    before(() => {
        process.chdir(exampleDir);
    });

    context("middleware", () => {
        context("babelDevTranspiler", () => {
            before(() => {
                fs.removeSync(path.join(exampleDir, "public"));
            });

            const babelDevTranspiler = require("../src/middleware/babelDevTranspiler");

            expect(babelDevTranspiler)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("babelDevTranspiler");

            const babelOptions = {
                "optional": [
                    "optimisation.modules.system",
                    "runtime",
                    "utility.inlineEnvironmentVariables"
                ],
                "sourceMaps": true,
                "stage": 0
            };

            const stubLogger = {
                info: () => {},
                meta: () => {},
                ok: () => {},
                warn: () => {}
            };

            const wildcatConfig = require("../src/utils/getWildcatConfig")();
            const generalSettings = wildcatConfig.generalSettings;
            const serverSettings = wildcatConfig.serverSettings;

            const exampleApplicationPath = `/${serverSettings.publicDir}/components/Application/Application.js`;
            const exampleBinaryPath = `/${serverSettings.publicDir}/assets/images/primary-background.jpg`;
            const exampleNonExistentPath = `/${serverSettings.publicDir}/foo.js`;
            const exampleUnaffectedPath = "/foo.js";

            const writeDelay = 200;

            const babelDevTranspilerInstance = babelDevTranspiler(exampleDir, {
                babelOptions,
                binDir: serverSettings.binDir,
                extensions: [".es6", ".js", ".es", ".jsx"],
                logger: stubLogger,
                origin: generalSettings.staticUrl,
                outDir: serverSettings.publicDir,
                sourceDir: serverSettings.sourceDir
            });

            it("transpiles a source file", (done) => {
                expect(pathExists.sync(path.join(exampleDir, "public")))
                    .to.be.false;

                co(function* () {
                    var result = yield babelDevTranspilerInstance.call({
                        request: {
                            url: exampleApplicationPath
                        },
                        response: {}
                    }, (next) => next());

                    return result;
                })
                    .then(() => setTimeout(() => {
                        expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                            .to.be.true;

                        done();
                    }, writeDelay))
                    .catch(e => done(e));
            });

            it("converts a binary file to an importable module", (done) => {
                expect(pathExists.sync(path.join(exampleDir, "public")))
                    .to.be.true;

                co(function* () {
                    var result = yield babelDevTranspilerInstance.call({
                        request: {
                            url: exampleBinaryPath
                        },
                        response: {}
                    }, (next) => next());

                    return result;
                })
                    .then(() => setTimeout(() => {
                        expect(pathExists.sync(path.join(exampleDir, exampleBinaryPath)))
                            .to.be.true;

                        const binaryFileContents = fs.readFileSync(path.join(exampleDir, exampleBinaryPath), "utf8");

                        expect(binaryFileContents)
                            .to.be.a("string")
                            .that.matches(/module\.exports = "(.*)";/);

                        done();
                    }, writeDelay))
                    .catch(e => done(e));
            });

            it("skips transpilation if file exists", (done) => {
                expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                    .to.be.true;

                co(function* () {
                    var result = yield babelDevTranspilerInstance.call({
                        request: {
                            url: exampleApplicationPath
                        },
                        response: {}
                    }, (next) => next());

                    return result;
                })
                    .then(() => {
                        expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                            .to.be.true;

                        done();
                    })
                    .catch(e => done(e));
            });

            it("ignores a request for a non-existent source", (done) => {
                expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                    .to.be.true;

                co(function* () {
                    var result = yield babelDevTranspilerInstance.call({
                        request: {
                            url: exampleNonExistentPath
                        },
                        response: {}
                    }, (next) => next());

                    return result;
                })
                    .then(() => {
                        done();
                    })
                    .catch(e => done(e));
            });

            it(`ignores a request that does not begin with /${serverSettings.publicDir}`, (done) => {
                expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                    .to.be.true;

                co(function* () {
                    var result = yield babelDevTranspilerInstance.call({
                        request: {
                            url: exampleUnaffectedPath
                        },
                        response: {}
                    }, (next) => next());

                    return result;
                })
                    .then(() => {
                        done();
                    })
                    .catch(e => done(e));
            });
        });
    });

    context("static server", () => {
        const nodeEnv = process.env.NODE_ENV;

        const expectations = {
            "development": [
                "Static server is running at"
            ],
            "production": [
                "Static server is running"
            ]
        };

        ["development", "production"].forEach(currentEnv => {
            context(currentEnv, () => {
                before(() => {
                    process.env.NODE_ENV = currentEnv;
                });

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
                                    defaultConfig.serverSettings.staticServer.protocol = currentProtocol;

                                    return defaultConfig;
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
                                        .that.equals(process.env.NODE_ENV);

                                    staticServer.close();
                                    done();
                                });
                        });
                    });
                });

                after(() => {
                    process.env.NODE_ENV = nodeEnv;
                });
            });
        });
    });

    after(() => {
        process.chdir(cwd);
    });
});
