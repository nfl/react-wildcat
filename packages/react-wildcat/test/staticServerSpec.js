"use strict";

const fs = require("fs-extra");
const cp = require("child_process");
const co = require("co");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

const cwd = process.cwd();
const path = require("path");
const pathExists = require("path-exists");
// const nexpect = require("nexpect");
const os = require("os");

const cluster = require("cluster");
const proxyquire = require("proxyquire");

/* eslint-disable max-nested-callbacks */
describe("react-wildcat", () => {
    const exampleDir = path.join(cwd, "example");

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
                warn: () => {},
                error: () => {}
            };

            const wildcatConfig = require("../src/utils/getWildcatConfig")();
            const generalSettings = wildcatConfig.generalSettings;
            const serverSettings = wildcatConfig.serverSettings;

            const exampleApplicationPath = `/${serverSettings.publicDir}/components/Application/Application.js`;
            const exampleApplicationSrcPath = `${serverSettings.sourceDir}/components/Application/Application.js`;
            const exampleIndexPath = `/${serverSettings.publicDir}/routes/IndexExample/IndexExample.js`;
            const exampleBinaryPath = `/${serverSettings.publicDir}/assets/images/primary-background.jpg`;
            const exampleFlexboxPath = `/${serverSettings.publicDir}/routes/FlexboxExample/FlexboxExample.js`;
            const exampleHelmetPath = `/${serverSettings.publicDir}/routes/HelmetExample/HelmetExample.js`;
            const exampleNonExistentPath = `/${serverSettings.publicDir}/foo.js`;
            const exampleUnaffectedPath = "/foo.js";

            const writeDelay = 200;
            const babelDevTranspilerOptions = {
                babelOptions,
                binDir: serverSettings.binDir,
                extensions: [".es6", ".js", ".es", ".jsx"],
                logger: stubLogger,
                logLevel: 2,
                origin: generalSettings.staticUrl,
                outDir: serverSettings.publicDir,
                sourceDir: serverSettings.sourceDir
            };

            const coverageOptions = {
                coverage: true,
                coverageSettings: {
                    env: "e2e",

                    e2e: {
                        instrumentation: {
                            excludes: [],

                            // Conditionally exclude files from coverage based on suite name.
                            onSuiteExcludeCoverage(suite) {
                                const suites = {
                                    "exampleFlexbox": [
                                        `!${exampleFlexboxPath.replace(/^\//, "")}`
                                    ]
                                };

                                return suites[suite];
                            }
                        },

                        reporting: {
                            dir: "coverage/e2e",
                            reports: ["lcov", "html"]
                        }
                    },

                    unit: {
                        instrumentation: {
                            excludes: []
                        },

                        reporting: {
                            dir: "coverage/unit",
                            reports: ["lcov", "html"]
                        }
                    }
                }
            };

            let babelDevTranspilerInstance = babelDevTranspiler(exampleDir, babelDevTranspilerOptions);

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

            it("waits for transpilation on simultaneous requests", (done) => {
                expect(pathExists.sync(path.join(exampleDir, "public")))
                    .to.be.true;

                co(function* () {
                    var result = yield* [
                        babelDevTranspilerInstance.call({
                            request: {
                                url: exampleIndexPath
                            },
                            response: {}
                        }, (next) => next()),

                        babelDevTranspilerInstance.call({
                            request: {
                                url: exampleIndexPath
                            },
                            response: {}
                        }, (next) => next())
                    ];

                    return result;
                })
                    .then(() => setTimeout(() => {
                        expect(pathExists.sync(path.join(exampleDir, exampleIndexPath)))
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

            it("transpiles an existing file on file change", (done) => {
                expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                    .to.be.true;

                expect(pathExists.sync(path.join(exampleDir, exampleApplicationSrcPath)))
                    .to.be.true;

                fs.createReadStream(exampleApplicationSrcPath)
                    .pipe(
                        fs.createOutputStream(exampleApplicationSrcPath)
                            .on("finish", function streamFinish() {
                                setTimeout(() => {
                                    expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                                        .to.be.true;

                                    done();
                                }, writeDelay);
                            })
                    );
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

            context("error handling", () => {
                beforeEach(() => {
                    fs.removeSync(path.join(exampleDir, "public"));
                });

                const stubError = new Error("An error occurred");
                let stubbedDevTranspiler;

                it("returns a transpilation error", (done) => {
                    stubbedDevTranspiler = proxyquire("../src/middleware/babelDevTranspiler.js", {
                        "babel-core": {
                            transformFile: (modulePath, options, cb) => {
                                return cb(stubError, {});
                            }
                        }
                    });

                    babelDevTranspilerInstance = stubbedDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions)
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleApplicationPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .catch(e => {
                            expect(e)
                                .to.be.an.instanceof(Error);

                            expect(e.message)
                                .to.equal(stubError.message);

                            done();
                        });
                });

                it("returns an importable error", (done) => {
                    stubbedDevTranspiler = proxyquire("../src/middleware/babelDevTranspiler.js", {
                        "fs-extra": {
                            createOutputStream: (targetPath) => {
                                const expectedPath = path.join(exampleDir, exampleBinaryPath);

                                const EventEmitter = require("events");
                                const emitter = new EventEmitter();

                                emitter.end = () => {
                                    if (targetPath === expectedPath) {
                                        return setTimeout(() => emitter.emit("error", stubError), writeDelay);
                                    }

                                    return setTimeout(() => emitter.emit("finish"), writeDelay);
                                };

                                return emitter;
                            },
                            createReadStream: () => {
                                const EventEmitter = require("events");
                                const emitter = new EventEmitter();

                                emitter.pipe = () => {};

                                return emitter;
                            }
                        }
                    });

                    let importableError;

                    babelDevTranspilerInstance = stubbedDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, {
                            logger: Object.assign({}, stubLogger, {
                                error: (err) => (importableError = err)
                            })
                        }, coverageOptions)
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleBinaryPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .then(() => setTimeout(() => {
                            expect(pathExists.sync(path.join(exampleDir, exampleBinaryPath)))
                                .to.be.false;

                            expect(importableError)
                                .to.exist;

                            expect(importableError)
                                .to.be.an.instanceof(Error);

                            expect(importableError.message)
                                .to.equal(stubError.message);

                            done();
                        }, writeDelay))
                        .catch(e => {
                            expect(e)
                                .to.be.an.instanceof(Error);

                            expect(e.message)
                                .to.equal(stubError.message);

                            done();
                        });
                });

                it("returns a binary error", (done) => {
                    // const exampleBinaryBinPath = path.join(exampleDir, "bin/assets/images/primary-background.jpg");
                    const exampleBinarySrcPath = path.join(exampleDir, "src/assets/images/primary-background.jpg");

                    stubbedDevTranspiler = proxyquire("../src/middleware/babelDevTranspiler.js", {
                        "fs-extra": {
                            createOutputStream: (targetPath) => {
                                const expectedPath = exampleBinarySrcPath;

                                const EventEmitter = require("events");
                                const emitter = new EventEmitter();

                                emitter.end = () => {
                                    if (targetPath === expectedPath) {
                                        return setTimeout(() => emitter.emit("error", stubError), writeDelay);
                                    }

                                    return setTimeout(() => emitter.emit("finish"), writeDelay);
                                };

                                return emitter;
                            },
                            createReadStream: (targetPath) => {
                                const expectedPath = exampleBinarySrcPath;

                                const EventEmitter = require("events");
                                const emitter = new EventEmitter();

                                emitter.pipe = (stream) => {
                                    if (targetPath === expectedPath) {
                                        return setTimeout(() => stream.emit("error", stubError), writeDelay);
                                    }

                                    return setTimeout(() => stream.emit("finish"), writeDelay);
                                };

                                return emitter;
                            }
                        }
                    });

                    babelDevTranspilerInstance = stubbedDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, coverageOptions)
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleBinaryPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .catch(e => {
                            expect(e)
                                .to.be.an.instanceof(Error);

                            expect(e.message)
                                .to.equal(stubError.message);

                            done();
                        });
                });

                it("returns an instrumentation error", (done) => {
                    stubbedDevTranspiler = proxyquire("../src/middleware/babelDevTranspiler.js", {
                        "istanbul": {
                            Instrumenter: (() => {
                                function InstrumenterStub() {}

                                InstrumenterStub.prototype = {
                                    instrument: (code, relativePath, cb) => {
                                        return cb(stubError);
                                    }
                                };

                                return InstrumenterStub;
                            })()
                        }
                    });

                    babelDevTranspilerInstance = stubbedDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, coverageOptions)
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleApplicationPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .catch(e => {
                            expect(e)
                                .to.be.an.instanceof(Error);

                            expect(e.message)
                                .to.equal(stubError.message);

                            done();
                        });
                });

                it("reports a coverage error", (done) => {
                    stubbedDevTranspiler = proxyquire("../src/middleware/babelDevTranspiler.js", {
                        "fs-extra": {
                            createOutputStream: (targetPath) => {
                                const expectedPath = path.join(exampleDir, exampleApplicationPath);

                                const EventEmitter = require("events");
                                const emitter = new EventEmitter();

                                emitter.end = () => {
                                    if (targetPath === expectedPath) {
                                        return setTimeout(() => emitter.emit("error", stubError), writeDelay);
                                    }

                                    return setTimeout(() => emitter.emit("finish"), writeDelay);
                                };

                                return emitter;
                            },
                            createReadStream: () => {}
                        }
                    });

                    let coverageError;

                    babelDevTranspilerInstance = stubbedDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, {
                            logger: Object.assign({}, stubLogger, {
                                error: (err) => (coverageError = err)
                            })
                        }, coverageOptions)
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleApplicationPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .then(() => setTimeout(() => {
                            expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                                .to.be.false;

                            expect(coverageError)
                                .to.exist;

                            expect(coverageError)
                                .to.be.an.instanceof(Error);

                            expect(coverageError.message)
                                .to.equal(stubError.message);

                            done();
                        }, writeDelay))
                        .catch(e => done(e));
                });

                it("does not transpile when data is ignored", (done) => {
                    stubbedDevTranspiler = proxyquire("../src/middleware/babelDevTranspiler.js", {
                        "babel-core": {
                            transformFile: (modulePath, options, cb) => {
                                return cb(null, {
                                    ignored: true
                                });
                            }
                        }
                    });

                    babelDevTranspilerInstance = stubbedDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions)
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleApplicationPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .then(() => setTimeout(() => {
                            expect(pathExists.sync(path.join(exampleDir, exampleApplicationPath)))
                                .to.be.false;

                            done();
                        }, writeDelay));
                });

                const testData = [{
                    babelOptions: {},
                    sourceMapShouldExist: false
                }, {
                    babelOptions: {
                        env: {}
                    },
                    sourceMapShouldExist: false
                }, {
                    babelOptions: {
                        sourceMaps: false
                    },
                    sourceMapShouldExist: false
                }, {
                    babelOptions: {
                        sourceMaps: true
                    },
                    sourceMapShouldExist: true
                }, {
                    babelOptions: {
                        env: {
                            development: {
                                sourceMaps: true
                            }
                        }
                    },
                    sourceMapShouldExist: true
                }];

                testData.forEach((test, idx) => {
                    it(`saves an external source map when specified #${idx + 1}`, (done) => {
                        stubbedDevTranspiler = proxyquire("../src/middleware/babelDevTranspiler.js", {
                            "babel-core": {
                                transformFile: (modulePath, options, cb) => {
                                    return cb(null, {
                                        map: true,
                                        code: "module.exports = function foo() {return true};"
                                    });
                                }
                            }
                        });

                        babelDevTranspilerInstance = stubbedDevTranspiler(
                            exampleDir,
                            Object.assign({}, babelDevTranspilerOptions, {
                                babelOptions: test.babelOptions
                            })
                        );

                        co(function* () {
                            const result = yield babelDevTranspilerInstance.call({
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

                                expect(pathExists.sync(path.join(exampleDir, `${exampleApplicationPath}.map`)))
                                    .to.equal(test.sourceMapShouldExist);

                                done();
                            }, writeDelay));
                    });
                });

                it("reports a source map error", (done) => {
                    const exampleApplicationMapPath = path.join(exampleDir, `${exampleApplicationPath}.map`);

                    stubbedDevTranspiler = proxyquire("../src/middleware/babelDevTranspiler.js", {
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

                                if (targetPath === exampleApplicationMapPath) {
                                    setTimeout(() => emitter.emit("error", stubError), writeDelay);
                                }

                                emitter.end = () => {};

                                return emitter;
                            },
                            createReadStream: () => {}
                        }
                    });

                    let sourceMapError;

                    babelDevTranspilerInstance = stubbedDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, {
                            babelOptions: {
                                sourceMaps: true
                            },
                            logger: Object.assign({}, stubLogger, {
                                error: (err) => (sourceMapError = err)
                            })
                        }, coverageOptions)
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleApplicationPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .then(() => setTimeout(() => {
                            expect(pathExists.sync(exampleApplicationMapPath))
                                .to.be.false;

                            expect(sourceMapError)
                                .to.exist;

                            expect(sourceMapError)
                                .to.be.an.instanceof(Error);

                            expect(sourceMapError.message)
                                .to.equal(stubError.message);

                            done();
                        }, writeDelay))
                        .catch(e => done(e));
                });
            });

            context("code coverage", () => {
                beforeEach(() => {
                    fs.removeSync(path.join(exampleDir, "public"));
                });

                it("includes coverage instrumentation", (done) => {
                    babelDevTranspilerInstance = babelDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, coverageOptions)
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
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

                            const applicationFileContents = fs.readFileSync(path.join(exampleDir, exampleApplicationPath), "utf8");

                            expect(applicationFileContents)
                                .to.be.a("string");

                            expect(applicationFileContents)
                                .to.be.a("string")
                                .that.includes("__cov_")
                                .and.includes(".__coverage__");

                            done();
                        }, writeDelay))
                        .catch(e => done(e));
                });

                it("scopes instrumentation to specified file path", (done) => {
                    process.env.COVERAGE_FILES = exampleFlexboxPath.replace(/^\//, "");

                    babelDevTranspilerInstance = babelDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, coverageOptions)
                    );

                    co(function* () {
                        // Stub request for exampleHelmetPath
                        yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleHelmetPath
                            },
                            response: {}
                        }, (next) => next());

                        // Stub request for exampleFlexboxPath
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleFlexboxPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .then(() => setTimeout(() => {
                            expect(pathExists.sync(path.join(exampleDir, exampleFlexboxPath)))
                                .to.be.true;

                            const helmetFileContents = fs.readFileSync(path.join(exampleDir, exampleHelmetPath), "utf8");

                            expect(helmetFileContents)
                                .to.be.a("string");

                            expect(helmetFileContents)
                                .to.not.include("__cov_")
                                .and.not.include(".__coverage__");

                            const flexboxFileContents = fs.readFileSync(path.join(exampleDir, exampleFlexboxPath), "utf8");

                            expect(flexboxFileContents)
                                .to.be.a("string");

                            expect(flexboxFileContents)
                                .to.be.a("string")
                                .that.includes("__cov_")
                                .and.includes(".__coverage__");

                            delete process.env.COVERAGE_FILES;
                            done();
                        }, writeDelay))
                        .catch(e => done(e));
                });

                it("scopes instrumentation to multiple targets", (done) => {
                    process.env.COVERAGE_FILES = [
                        exampleFlexboxPath.replace(/^\//, ""),
                        exampleHelmetPath.replace(/^\//, "")
                    ].join();

                    babelDevTranspilerInstance = babelDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, coverageOptions)
                    );

                    co(function* () {
                        // Stub request for exampleHelmetPath
                        yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleHelmetPath
                            },
                            response: {}
                        }, (next) => next());

                        // Stub request for exampleFlexboxPath
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleFlexboxPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .then(() => setTimeout(() => {
                            expect(pathExists.sync(path.join(exampleDir, exampleFlexboxPath)))
                                .to.be.true;

                            const helmetFileContents = fs.readFileSync(path.join(exampleDir, exampleHelmetPath), "utf8");

                            expect(helmetFileContents)
                                .to.be.a("string");

                            expect(helmetFileContents)
                                .that.includes("__cov_")
                                .and.includes(".__coverage__");

                            const flexboxFileContents = fs.readFileSync(path.join(exampleDir, exampleFlexboxPath), "utf8");

                            expect(flexboxFileContents)
                                .to.be.a("string");

                            expect(flexboxFileContents)
                                .to.be.a("string")
                                .that.includes("__cov_")
                                .and.includes(".__coverage__");

                            delete process.env.COVERAGE_FILES;
                            done();
                        }, writeDelay))
                        .catch(e => done(e));
                });

                it("scopes instrumentation to suites", (done) => {
                    delete process.env.COVERAGE_FILES;
                    process.env.COVERAGE_SUITE = "exampleFlexbox";

                    babelDevTranspilerInstance = babelDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, coverageOptions)
                    );

                    co(function* () {
                        // Stub request for exampleHelmetPath
                        yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleHelmetPath
                            },
                            response: {}
                        }, (next) => next());

                        // Stub request for exampleFlexboxPath
                        const result = yield babelDevTranspilerInstance.call({
                            request: {
                                url: exampleFlexboxPath
                            },
                            response: {}
                        }, (next) => next());

                        return result;
                    })
                        .then(() => setTimeout(() => {
                            expect(pathExists.sync(path.join(exampleDir, exampleFlexboxPath)))
                                .to.be.true;

                            const helmetFileContents = fs.readFileSync(path.join(exampleDir, exampleHelmetPath), "utf8");

                            expect(helmetFileContents)
                                .to.be.a("string");

                            expect(helmetFileContents)
                                .to.not.include("__cov_")
                                .and.not.include(".__coverage__");

                            const flexboxFileContents = fs.readFileSync(path.join(exampleDir, exampleFlexboxPath), "utf8");

                            expect(flexboxFileContents)
                                .to.be.a("string");

                            expect(flexboxFileContents)
                                .to.be.a("string")
                                .that.includes("__cov_")
                                .and.includes(".__coverage__");

                            delete process.env.COVERAGE_SUITE;
                            done();
                        }, writeDelay))
                        .catch(e => done(e));
                });

                it("instruments all files when a coverage target is missing", (done) => {
                    babelDevTranspilerInstance = babelDevTranspiler(
                        exampleDir,
                        Object.assign({}, babelDevTranspilerOptions, {
                            coverage: true,
                            coverageSettings: {}
                        })
                    );

                    co(function* () {
                        const result = yield babelDevTranspilerInstance.call({
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

                            const applicationFileContents = fs.readFileSync(path.join(exampleDir, exampleApplicationPath), "utf8");

                            expect(applicationFileContents)
                                .to.be.a("string");

                            expect(applicationFileContents)
                                .to.be.a("string")
                                .that.includes("__cov_")
                                .and.includes(".__coverage__");

                            done();
                        }, writeDelay))
                        .catch(e => done(e));
                });
            });
        });
    });


    context("cluster", ()=> {
        context("When attempting to start a cluster of static servers", function () {
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
                server = proxyquire("../src/staticServer.js", {
                    "./utils/getWildcatConfig": () => {
                        const defaultConfig = require("../src/utils/getWildcatConfig")();
                        defaultConfig.serverSettings.staticServer.maxClusterCpuCount = 1;
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
                server = proxyquire("../src/staticServer.js", {
                    "./utils/getWildcatConfig": () => {
                        const defaultConfig = require("../src/utils/getWildcatConfig")();
                        defaultConfig.serverSettings.staticServer.maxClusterCpuCount = 2;

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
                server = proxyquire("../src/staticServer.js", {
                    "./utils/getWildcatConfig": () => {
                        const defaultConfig = require("../src/utils/getWildcatConfig")();
                        defaultConfig.serverSettings.staticServer.maxClusterCpuCount = Infinity;
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
