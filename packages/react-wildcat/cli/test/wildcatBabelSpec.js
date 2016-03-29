"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const fs = require("fs-extra");
const path = require("path");

const resolve = require("resolve");

const glob = require("glob");
const proxyquire = require("proxyquire");
const pathExists = require("path-exists");

describe("cli - wildcatBabel", () => {
    const stubs = require("./fixtures");
    const loggerStub = {};

    beforeEach(() => {
        process.chdir(stubs.exampleDir);

        [
            stubs.binDir,
            stubs.publicDir,
            stubs.manifestTestFile,
            stubs.failureTestFile
        ].forEach(fs.removeSync);
    });

    before(() => {
        Object.keys(stubs.logMethods).forEach(method => {
            loggerStub[method] = sinon.stub(stubs.logger, method);
            loggerStub[method].returns();
        });
    });

    after(() => {
        Object.keys(stubs.logMethods).forEach(method => {
            loggerStub[method].restore();
        });
    });

    context("wildcat-babel --watch", () => {
        it("starts the file watcher", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                    watch: true
                })),
                "../src/utils/logger": stubs.LoggerStub
            })
                .then((watcher) => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(watcher)
                        .to.exist;

                    expect(watcher)
                        .to.respondTo("close");

                    watcher.close();
                    done();
                })
                .catch(done);
        });

        it("watches for new file additions", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                    args: [
                        stubs.sourceDir
                    ],
                    watch: true
                })),
                "../src/utils/logger": stubs.LoggerStub
            })
                .then((watcher) => {
                    const testFilePath = path.join(stubs.exampleDir, stubs.sourceDir, "test.js");
                    const testFileContents = `export default {};`;

                    expect(wildcatBabel)
                        .to.exist;

                    expect(watcher)
                        .to.exist;

                    watcher.on("add", filename => {
                        setTimeout(() => {
                            expect(pathExists.sync(stubs.getPublicPath(filename)))
                                .to.be.true;

                            const transpiledTestFileContents = fs.readFileSync(stubs.getPublicPath(filename), "utf8");

                            expect(transpiledTestFileContents)
                                .to.be.a("string");

                            expect(watcher)
                                .to.respondTo("close");

                            fs.removeSync(filename);
                            watcher.close();
                            done();
                        }, stubs.writeDelay);
                    });

                    fs.createOutputStream(testFilePath)
                        .end(testFileContents);
                })
                .catch(e => done(e));
        });
    });

    context("wildcat-babel", () => {
        it("transpiles a file with default parameters", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new stubs.CommanderStub(stubs.commanderDefaults),
                "../src/utils/logger": stubs.LoggerStub
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(stubs.mainEntryTranspiledPath))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("transpiles files with a directory as entry path", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                    args: [
                        stubs.sourceDir
                    ]
                })),
                "../src/utils/logger": stubs.LoggerStub
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(stubs.mainEntryTranspiledPath))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("transpiles a file with no default extensions", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                    extensions: undefined
                })),
                "../src/utils/logger": stubs.LoggerStub
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(stubs.mainEntryTranspiledPath))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("transpiles a file with no default outDir", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                    outDir: undefined
                })),
                "../src/utils/logger": stubs.LoggerStub
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(stubs.mainEntryTranspiledPath))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("transpiles files using a manifest file", (done) => {
            fs.outputFileSync(stubs.manifestTestFile, stubs.mainEntrySourcePath, "utf8");

            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                    args: [],

                    manifest: "manifest.txt"
                })),
                "../src/utils/logger": stubs.LoggerStub
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(stubs.mainEntryTranspiledPath))
                        .to.be.true;

                    fs.removeSync(path.join(stubs.exampleDir, stubs.manifestTestFile));
                    done();
                })
                .catch(done);
        });

        [{
            name: "all available workers",
            cpus: undefined
        }, {
            name: "a specified number of workers",
            cpus: Math.floor(require("os").cpus().length / 2)
        }, {
            name: "a single worker",
            cpus: 1
        }].forEach(test => {
            it(`transpiles multiple files across ${test.name}`, (done) => {
                const ignoredFiles = [
                    "**/{shell,e2e,test}/**"
                ];

                const wildcatBabel = proxyquire("../wildcatBabel.js", {
                    "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                        args: [
                            stubs.sourceDir
                        ],

                        cpus: test.cpus,
                        ignore: ignoredFiles
                    })),
                    "../src/utils/logger": stubs.LoggerStub
                })
                    .then(() => {
                        expect(wildcatBabel)
                            .to.exist;

                        const binFiles = glob.sync(`${stubs.binDir}/**/*`, {
                            nodir: true,
                            ignore: ignoredFiles
                        });

                        const publicFiles = glob.sync(`${stubs.publicDir}/**/*`, {
                            nodir: true,
                            ignore: ignoredFiles
                        });

                        const sourceFiles = glob.sync(`${stubs.sourceDir}/**/*`, {
                            nodir: true,
                            ignore: ignoredFiles
                        });

                        expect(binFiles)
                            .to.have.length.of(
                                sourceFiles
                                    .filter(sourceFile => sourceFile.endsWith(".jpg")).length
                            );

                        expect(binFiles)
                            .to.eql(
                                sourceFiles
                                    .filter(sourceFile => sourceFile.endsWith(".jpg"))
                                    .map(sourceFile => stubs.getBinPath(sourceFile))
                            );

                        expect(pathExists.sync(path.join(stubs.exampleDir, stubs.exampleBinaryPath)))
                            .to.be.true;

                        const origin = stubs.generalSettings.staticUrl;
                        const binaryFileContents = fs.readFileSync(path.join(stubs.exampleDir, stubs.exampleBinaryPath), "utf8");

                        expect(binaryFileContents)
                            .to.be.a("string")
                            .that.equals(`module.exports = "${origin}${stubs.getBinPath(stubs.exampleBinaryPath)}";`);

                        expect(publicFiles)
                            .to.have.length.of(sourceFiles.length);

                        expect(publicFiles)
                            .to.eql(sourceFiles.map(sourceFile => stubs.getPublicPath(sourceFile)));

                        done();
                    })
                    .catch(done);
            });
        });

        it("uses react-wildcat/node_modules/babel if project Babel is not found", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel", {
                "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                    args: [
                        stubs.mainEntrySourcePath
                    ]
                })),
                "resolve": {
                    sync: () => resolve.sync("noop")
                },
                "../src/utils/logger": stubs.LoggerStub
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(stubs.mainEntryTranspiledPath))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("throws an error on other resolve errors", (done) => {
            try {
                proxyquire("../wildcatBabel", {
                    "commander": new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                        args: [
                            stubs.mainEntrySourcePath
                        ]
                    })),
                    "resolve": {
                        sync: () => {
                            throw stubs.errorStub;
                        }
                    },
                    "../src/utils/logger": stubs.LoggerStub
                });
            } catch (err) {
                expect(err)
                    .to.exist;

                expect(err)
                    .to.be.an.instanceof(Error);

                expect(err)
                    .to.eql(stubs.errorStub);

                done();
            }
        });
    });

    context("utils", () => {
        require("./utils/copyFilesSpec")(stubs, loggerStub);
        require("./utils/handleSpec")(stubs, loggerStub);
        require("./utils/handleFileSpec")(stubs, loggerStub);
        require("./utils/transpilerSpec")(stubs, loggerStub);
    });
});
