const fs = require("fs-extra");
const path = require("path");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const proxyquire = require("proxyquire").noPreserveCache();
const pathExists = require("path-exists");

module.exports = (stubs) => {
    "use strict";

    describe("createTranspiledModule", () => {
        // Conditionally exclude files from coverage based on suite name.
        const onSuiteExcludeCoverage = function onSuiteExcludeCoverageStub(suite) {
            return `!**/${suite}/**`;
        };

        const loggerStub = {};

        beforeEach(() => {
            [
                "error",
                "meta"
            ].forEach(method => {
                loggerStub[method] = sinon.stub(stubs.logger, method);
                loggerStub[method].returns();
            });
        });

        afterEach(() => {
            [
                "error",
                "meta"
            ].forEach(method => {
                loggerStub[method].restore();
            });

            [
                stubs.binDir,
                stubs.publicDir
            ].forEach(fs.removeSync);
        });

        [{
            name: "transpiles a source file",
            transpileOptions: stubs.transpileModuleDefaults,
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            outputContents: [
                `var _routesConfig = require("./routes.config.js");`
            ]
        }, {
            name: "transpiles a source file with code coverage instrumentation",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true
            }),
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            outputContents: [
                `__cov_`,
                `__coverage__`
            ]
        }, {
            name: "transpiles a source file with no transpiler provided",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined
            }),
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            outputContents: [
                `var _routesConfig = require("./routes.config.js");`
            ]
        }, {
            name: "does not log output if logLevel is under 1",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                logLevel: 0
            }),
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            outputContents: [
                `var _routesConfig = require("./routes.config.js");`
            ]
        }, {
            name: "does not save Promise to a cache if temporaryCache setting is falsy",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                temporaryCache: undefined
            }),
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            outputContents: [
                `var _routesConfig = require("./routes.config.js");`
            ]
        }, {
            name: "waits for the transpiled file to write to disk",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                waitForFileWrite: true
            }),
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            outputContents: [
                `var _routesConfig = require("./routes.config.js");`
            ]
        }].forEach(test => {
            it(test.name, (done) => {
                const createTranspiledModule = require("../../src/utils/createTranspiledModule");

                new Promise((resolve, reject) => createTranspiledModule(test.transpileOptions, resolve, reject))
                    .then((response) => {
                        setTimeout(() => {
                            expect(response)
                                .to.exist;

                            expect(response)
                                .to.be.an("object");

                            expect(response)
                                .to.have.property("type")
                                .that.is.a("string")
                                .that.equals("application/x-es-module");

                            expect(response)
                                .to.have.property("length")
                                .that.is.a("number");

                            expect(response)
                                .to.have.property("body")
                                .that.is.a("string")
                                .that.has.length.of.at.least(1);

                            expect(response)
                                .to.have.property("status")
                                .that.is.a("number")
                                .that.equals(200);

                            expect(pathExists.sync(test.outputPath))
                                .to.be.true;

                            const fileContents = fs.readFileSync(test.outputPath, "utf8");

                            test.outputContents.forEach(contents => {
                                expect(fileContents)
                                    .to.be.a("string")
                                    .that.includes(contents);
                            });

                            done();
                        }, stubs.writeDelay);
                    })
                    .catch(done);
            });
        });

        [{
            name: "scopes coverage instrumentation to specified file",
            env: {
                COVERAGE_FILES: "**/*.js"
            },
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true
            }),
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            coverageShouldExist: true
        }, {
            name: "scopes coverage instrumentation to specified files",
            env: {
                COVERAGE_FILES: "**/*Routes.js,**/*.config.js"
            },
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true
            }),
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            coverageShouldExist: false
        }, {
            name: "scopes coverage instrumentation to specified suite",
            env: {
                COVERAGE_SUITE: `public`
            },
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true,
                coverageSettings: {
                    env: "e2e",

                    e2e: {
                        instrumentation: {
                            onSuiteExcludeCoverage
                        }
                    }
                }
            }),
            coverageShouldExist: true
        }, {
            name: "should not add coverage if scope is outside of specified suite",
            env: {
                COVERAGE_SUITE: `assets`
            },
            outputPath: path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath),
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true,
                coverageSettings: {
                    env: "e2e",

                    e2e: {
                        instrumentation: {
                            onSuiteExcludeCoverage
                        }
                    }
                }
            }),
            coverageShouldExist: false
        }].forEach(test => {
            it(test.name, (done) => {
                const cachedEnv = {};

                Object.keys(test.env)
                    .forEach(v => cachedEnv[v] = process.env[v]);

                Object.keys(test.env)
                    .forEach(v => process.env[v] = test.env[v]);

                const createTranspiledModule = proxyquire("../../src/utils/createTranspiledModule", {});

                new Promise((resolve, reject) => createTranspiledModule(test.transpileOptions, resolve, reject))
                    .then((response) => {
                        Object.keys(cachedEnv).forEach(v => delete process.env[v]);

                        setTimeout(() => {
                            // console.log(response);
                            expect(response)
                                .to.exist;

                            expect(response)
                                .to.be.an("object");

                            expect(response)
                                .to.have.property("type")
                                .that.is.a("string")
                                .that.equals("application/x-es-module");

                            expect(response)
                                .to.have.property("length")
                                .that.is.a("number");

                            expect(response)
                                .to.have.property("body")
                                .that.is.a("string")
                                .that.has.length.of.at.least(1);

                            expect(response)
                                .to.have.property("status")
                                .that.is.a("number")
                                .that.equals(200);

                            expect(pathExists.sync(test.outputPath))
                                .to.be.true;

                            const fileContents = fs.readFileSync(test.outputPath, "utf8");

                            [
                                `__cov_`,
                                `__coverage__`
                            ].forEach(contents => {
                                expect(fileContents)
                                    .to.be.a("string");

                                if (test.coverageShouldExist) {
                                    expect(fileContents)
                                        .to.include(contents);
                                } else {
                                    expect(fileContents)
                                        .to.not.include(contents);
                                }
                            });

                            done();
                        }, stubs.writeDelay);
                    })
                    .catch(done);
            });
        });

        it("returns a transpile error", (done) => {
            const createTranspiledModule = proxyquire("../../src/utils/createTranspiledModule", {
                "babel-core": {
                    transformFile: (src, options, cb) => cb(stubs.errorStub)
                }
            });

            new Promise((resolve, reject) => createTranspiledModule(Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined
            }), resolve, reject))
                .then(response => console.log("response", response))
                .catch(err => {
                    expect(err)
                        .to.exist;

                    expect(err)
                        .to.be.an.instanceof(Error);

                    expect(err)
                        .to.equal(stubs.errorStub);

                    done();
                });
        });

        [{
            name: "returns an instrumentation error",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true,
                temporaryCache: undefined
            })
        }, {
            name: "returns an instrumentation error and deletes the Promised result from cache",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true
            })
        }].forEach(test => {
            it(test.name, (done) => {
                const createTranspiledModule = proxyquire("../../src/utils/createTranspiledModule", {
                    "istanbul": {
                        Instrumenter: (() => {
                            function InstrumenterStub() {}

                            InstrumenterStub.prototype = {
                                instrument: (code, relativePath, cb) => {
                                    return cb(stubs.errorStub);
                                }
                            };

                            return InstrumenterStub;
                        })()
                    }
                });

                new Promise((resolve, reject) => createTranspiledModule(test.transpileOptions, resolve, reject))
                    .catch(err => {
                        expect(err)
                            .to.exist;

                        expect(err)
                            .to.be.an.instanceof(Error);

                        expect(err)
                            .to.equal(stubs.errorStub);

                        done();
                    });
            });
        });

        [{
            name: "reports an coverage error",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true,
                temporaryCache: undefined
            })
        }, {
            name: "reports a coverage error and deletes the Promised result from cache",
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                coverage: true
            })
        }].forEach(test => {
            it(test.name, (done) => {
                const createTranspiledModule = proxyquire("../../src/utils/createTranspiledModule", {
                    "fs-extra": {
                        createOutputStream: (targetPath) => {
                            const expectedPath = path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath);

                            const EventEmitter = require("events");
                            const emitter = new EventEmitter();

                            emitter.end = () => {
                                if (targetPath === expectedPath) {
                                    return setTimeout(() => emitter.emit("error", stubs.errorStub), stubs.writeDelay);
                                }

                                return setTimeout(() => emitter.emit("finish"), stubs.writeDelay);
                            };

                            return emitter;
                        },
                        createReadStream: () => {}
                    }
                });

                new Promise((resolve, reject) => createTranspiledModule(test.transpileOptions, resolve, reject))
                    .then(() => setTimeout(() => {
                        expect(loggerStub.error.lastCall)
                            .to.have.been.calledWith(stubs.errorStub);

                        done();
                    }, stubs.writeDelay))
                    .catch(done);
            });
        });

        it("does not transpile when data is ignored", (done) => {
            const createTranspiledModule = proxyquire("../../src/utils/createTranspiledModule", {
                "babel-core": {
                    transformFile: (src, options, cb) => cb(null, {
                        ignored: true
                    })
                }
            });

            new Promise((resolve, reject) => createTranspiledModule(Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined
            }), resolve, reject))
                .then(response => {
                    expect(response)
                        .to.not.exist;

                    expect(pathExists.sync(path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath)))
                        .to.be.false;

                    done();
                })
                .catch(done);
        });

        [{
            transpileOptions: stubs.transpileModuleDefaults,
            sourceMapShouldExist: false
        }, {
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined,
                babelOptions: {
                    env: {}
                }
            }),
            sourceMapShouldExist: false
        }, {
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined,
                babelOptions: {
                    sourceMaps: false
                }
            }),
            sourceMapShouldExist: false
        }, {
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined,
                babelOptions: {
                    sourceMaps: true
                }
            }),
            sourceMapShouldExist: true
        }, {
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined,
                babelOptions: {
                    env: {
                        development: {
                            sourceMaps: true
                        }
                    }
                }
            }),
            sourceMapShouldExist: true
        }, {
            transpileOptions: Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined,
                logLevel: 0,
                babelOptions: {
                    env: {
                        development: {
                            sourceMaps: true
                        }
                    }
                }
            }),
            sourceMapShouldExist: true
        }].forEach((test, idx) => {
            it(`saves an external source map when specified #${idx + 1}`, (done) => {
                const createTranspiledModule = proxyquire("../../src/utils/createTranspiledModule", {
                    "babel-core": {
                        transformFile: (modulePath, options, cb) => {
                            return cb(null, {
                                map: true,
                                code: "module.exports = function foo() {return true};"
                            });
                        }
                    }
                });

                new Promise((resolve, reject) => createTranspiledModule(Object.assign({}, test.transpileOptions), resolve, reject))
                    .then(() => setTimeout(() => {
                        expect(pathExists.sync(
                            path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath)
                        ))
                            .to.be.true;

                        expect(pathExists.sync(
                            path.join(stubs.exampleDir, `${stubs.mainEntryTranspiledPath}.map`)
                        ))
                            .to.equal(test.sourceMapShouldExist);

                        done();
                    }, stubs.writeDelay))
                    .catch(done);
            });
        });

        it("reports a source map error", (done) => {
            const mainEntryTranspiledMapPath = path.join(stubs.exampleDir, `${stubs.mainEntryTranspiledPath}.map`);

            const createTranspiledModule = proxyquire("../../src/utils/createTranspiledModule", {
                "babel-core": {
                    transformFile: (modulePath, options, cb) => {
                        return cb(null, {
                            map: true,
                            code: "module.exports = function foo() {return true};"
                        });
                    }
                },
                "fs-extra": {
                    createOutputStream: (targetPath) => {
                        const EventEmitter = require("events");
                        const emitter = new EventEmitter();

                        if (targetPath === mainEntryTranspiledMapPath) {
                            setTimeout(() => emitter.emit("error", stubs.errorStub), stubs.writeDelay);
                        }

                        emitter.end = () => {};

                        return emitter;
                    },
                    createReadStream: () => {}
                }
            });

            new Promise((resolve, reject) => createTranspiledModule(Object.assign({}, stubs.transpileModuleDefaults, {
                babel: undefined,
                babelOptions: {
                    sourceMaps: true
                }
            }), resolve, reject))
                .then(() => setTimeout(() => {
                    expect(pathExists.sync(
                        path.join(stubs.exampleDir, stubs.mainEntryTranspiledPath)
                    ))
                        .to.be.false;

                    expect(loggerStub.error.lastCall)
                        .to.have.been.calledWith(stubs.errorStub);

                    done();
                }, stubs.writeDelay))
                .catch(done);
        });
    });
};
