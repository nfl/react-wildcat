"use strict";

const chai = require("chai");
const expect = chai.expect;

const fs = require("fs-extra");
const cwd = process.cwd();
const path = require("path");

const glob = require("glob");
const proxyquire = require("proxyquire");
const pathExists = require("path-exists");

/* eslint-disable max-nested-callbacks */
describe("cli - wildcatBabel", () => {
    const wildcatConfig = require("../../src/utils/getWildcatConfig")(cwd);
    const generalSettings = wildcatConfig.generalSettings;
    const serverSettings = wildcatConfig.serverSettings;

    const binDir = serverSettings.binDir;
    const publicDir = serverSettings.publicDir;
    const sourceDir = serverSettings.sourceDir;

    function CommanderStub(options) {
        Object.keys(options).forEach(k => this[k] = options[k]);

        this.version = () => this;
        this.option = () => this;
        this.parse = () => this;

        return this;
    }

    function getBinPath(source) {
        return source
            .replace(publicDir, binDir)
            .replace(sourceDir, binDir);
    }

    function getPublicPath(source) {
        return source
            .replace(binDir, publicDir)
            .replace(sourceDir, publicDir);
    }

    const exampleDir = path.join(cwd, "example");
    const mainEntrySourcePath = `${sourceDir}/main.js`;
    const mainEntryTranspiledPath = path.join(exampleDir, getPublicPath(mainEntrySourcePath));
    const exampleBinaryPath = `/${publicDir}/assets/images/primary-background.jpg`;
    const writeDelay = 200;

    const commanderDefaults = {
        args: [
            mainEntrySourcePath
        ],

        extensions: [
            ".es6",
            ".js",
            ".es",
            ".jsx"
        ],

        watch: undefined,
        outDir: publicDir,
        ignore: undefined,
        copyFiles: true,
        binaryToModule: true,
        manifest: undefined,
        cpus: undefined,
        quiet: true
    };

    beforeEach(() => {
        process.chdir(exampleDir);
        fs.removeSync(path.join(exampleDir, publicDir));
    });

    context("building", () => {
        it("transpiles a file with default parameters", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new CommanderStub(commanderDefaults)
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(mainEntryTranspiledPath))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("transpiles a file with no default extensions", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new CommanderStub(Object.assign({}, commanderDefaults, {
                    extensions: undefined
                }))
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(mainEntryTranspiledPath))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("transpiles a file with no default outDir", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new CommanderStub(Object.assign({}, commanderDefaults, {
                    outDir: undefined
                }))
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(mainEntryTranspiledPath))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("transpiles a file with code coverage instrumentation", (done) => {
            const wildcatStub = (c) => {
                const defaultConfig = require("../../src/utils/getWildcatConfig")(c);
                defaultConfig.generalSettings.coverage = "e2e";

                return defaultConfig;
            };

            wildcatStub["@global"] = true;

            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new CommanderStub(commanderDefaults),
                "../../src/utils/getWildcatConfig": wildcatStub
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(mainEntryTranspiledPath))
                        .to.be.true;

                    const mainFileContents = fs.readFileSync(mainEntryTranspiledPath, "utf8");

                    expect(mainFileContents)
                        .to.be.a("string");

                    expect(mainFileContents)
                        .to.be.a("string")
                        .that.includes("__cov_")
                        .and.includes(".__coverage__");

                    done();
                })
                .catch(done);
        });

        it("transpiles files using a manifest file", (done) => {
            fs.outputFileSync("manifest.txt", mainEntrySourcePath, "utf8");

            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new CommanderStub(Object.assign({}, commanderDefaults, {
                    args: [],

                    manifest: "manifest.txt"
                }))
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(mainEntryTranspiledPath))
                        .to.be.true;

                    fs.removeSync(path.join(exampleDir, "manifest.txt"));
                    done();
                })
                .catch(done);
        });

        [{
            name: "all available CPUs",
            cpus: undefined
        }, {
            name: "a specified number of CPUs",
            cpus: Math.floor(require("os").cpus().length / 2)
        }, {
            name: "a single CPUs",
            cpus: 1
        }].forEach(test => {
            it(`transpiles multiple files across ${test.name}`, (done) => {
                const ignoredFiles = [
                    "**/{shell,e2e,test}/**"
                ];

                const wildcatBabel = proxyquire("../wildcatBabel.js", {
                    "commander": new CommanderStub(Object.assign({}, commanderDefaults, {
                        args: [
                            sourceDir
                        ],

                        cpus: test.cpus,
                        ignore: ignoredFiles
                    }))
                })
                    .then(() => {
                        expect(wildcatBabel)
                            .to.exist;

                        const binFiles = glob.sync(`${binDir}/**/*`, {
                            nodir: true,
                            ignore: ignoredFiles
                        });

                        const publicFiles = glob.sync(`${publicDir}/**/*`, {
                            nodir: true,
                            ignore: ignoredFiles
                        });

                        const sourceFiles = glob.sync(`${sourceDir}/**/*`, {
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
                                    .map(sourceFile => getBinPath(sourceFile))
                            );

                        expect(pathExists.sync(path.join(exampleDir, exampleBinaryPath)))
                            .to.be.true;

                        const origin = generalSettings.staticUrl;
                        const binaryFileContents = fs.readFileSync(path.join(exampleDir, exampleBinaryPath), "utf8");

                        expect(binaryFileContents)
                            .to.be.a("string")
                            .that.equals(`module.exports = "${origin}${getBinPath(exampleBinaryPath)}";`);

                        expect(publicFiles)
                            .to.have.length.of(sourceFiles.length);

                        expect(publicFiles)
                            .to.eql(sourceFiles.map(sourceFile => getPublicPath(sourceFile)));

                        done();
                    })
                    .catch(done);
            });
        });

        it("avoids ignored file patterns", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new CommanderStub(Object.assign({}, commanderDefaults, {
                    args: [
                        mainEntrySourcePath,
                        `${sourceDir}/components/Application/*.js`
                    ],
                    ignore: [`${sourceDir}/*.js`]
                }))
            })
                .then(() => {
                    expect(wildcatBabel)
                        .to.exist;

                    expect(pathExists.sync(path.join(exampleDir, publicDir, "components/Application/Application.js")))
                        .to.be.true;

                    expect(pathExists.sync(path.join(exampleDir, publicDir, "components/Application/ApplicationContext.js")))
                        .to.be.true;

                    done();
                })
                .catch(done);
        });

        it("throws an error if Babel is not found", (done) => {
            try {
                proxyquire("../wildcatBabel.js", {
                    "commander": new CommanderStub(commanderDefaults),
                    "resolve": {
                        sync: () => "noop"
                    }
                });
            } catch (err) {
                expect(err)
                    .to.exist;

                expect(err)
                    .to.be.an.instanceof(Error);

                expect(err)
                    .to.have.property("code")
                    .that.equals("MODULE_NOT_FOUND");

                expect(err.message)
                    .to.equal("Cannot find module 'babel'");

                done();
            }
        });

        it("fails gracefully on non-related errors", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "babel": null,
                "commander": new CommanderStub(commanderDefaults)
            })
            .then(() => {
                expect(wildcatBabel)
                    .to.exist;

                expect(pathExists.sync(mainEntryTranspiledPath))
                    .to.be.true;

                done();
            })
            .catch(done);
        });
    });

    context("watching", () => {
        it("starts the file watcher", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new CommanderStub(Object.assign({}, commanderDefaults, {
                    watch: true
                }))
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
                .catch(e => done(e));
        });

        it("watches for new file additions", (done) => {
            const wildcatBabel = proxyquire("../wildcatBabel.js", {
                "commander": new CommanderStub(Object.assign({}, commanderDefaults, {
                    args: [
                        sourceDir
                    ],
                    watch: true
                }))
            })
                .then((watcher) => {
                    const testFilePath = path.join(exampleDir, sourceDir, "test.js");
                    const testFileContents = `export default {};`;

                    expect(wildcatBabel)
                        .to.exist;

                    expect(watcher)
                        .to.exist;

                    watcher.on("add", filename => {
                        setTimeout(() => {
                            expect(pathExists.sync(getPublicPath(filename)))
                                .to.be.true;

                            const transpiledTestFileContents = fs.readFileSync(getPublicPath(filename), "utf8");

                            expect(transpiledTestFileContents)
                                .to.be.a("string");

                            fs.removeSync(filename);

                            expect(watcher)
                                .to.respondTo("close");

                            watcher.close();
                            done();
                        }, writeDelay);
                    });

                    fs.createOutputStream(testFilePath)
                        .end(testFileContents);
                })
                .catch(e => done(e));
        });
    });
});
