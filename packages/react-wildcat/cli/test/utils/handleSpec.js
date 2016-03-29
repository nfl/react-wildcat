"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const fs = require("fs-extra");

const glob = require("glob");
const proxyquire = require("proxyquire");
const pathExists = require("path-exists");

module.exports = (stubs, loggerStub) => {
    "use strict";

    describe("handle", () => {
        const ignoredFiles = [
            "**/{shell,e2e,test}/**"
        ];

        const testOptions = {
            args: [
                stubs.sourceDir
            ],

            ignore: ignoredFiles
        };

        [{
            name: "transpiles a file",
            entry: stubs.mainEntrySourcePath,
            output: stubs.mainEntryTranspiledPath,
            outputContents: [
                `var _routesConfigJs = require("./routes.config.js");`
            ],
            commanderOptions: testOptions
        }].forEach((test) => {
            it(test.name, (done) => {
                const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, test.commanderOptions));
                const handle = require("../../utils/handle")(commanderStub, stubs.wildcatOptions);

                handle(test.entry)
                    .then(() => {
                        expect(commanderStub)
                            .to.exist;

                        expect(pathExists.sync(test.output))
                            .to.be.true;

                        const fileContents = fs.readFileSync(test.output, "utf8");

                        test.outputContents.forEach(contents => {
                            expect(fileContents)
                                .to.be.a("string")
                                .that.includes(contents);
                        });

                        done();
                    })
                    .catch(done);
            });
        });

        it("transpiles all files in a directory", (done) => {
            const testEntry = `${stubs.sourceDir}/components/Application`;
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                args: [
                    testEntry
                ],

                cpus: 1
            }));

            const handle = proxyquire("../../utils/handle", {
                "glob": (pattern, options, cb) => {
                    glob(pattern, options, (err, files) => {
                        const clonedFiles = Array.from({
                            length: 9
                        }, () => files)
                            .reduce(function (a, b) {
                                return a.concat(b);
                            }, []);

                        return cb(err, clonedFiles);
                    });
                }
            })(commanderStub, stubs.wildcatOptions);

            handle(testEntry)
                .then(() => {
                    const publicFiles = glob.sync(`${stubs.getPublicPath(testEntry)}/**`);
                    const sourceFiles = glob.sync(`${testEntry}/**`);

                    expect(publicFiles)
                        .to.have.length.of(sourceFiles.length);

                    expect(publicFiles)
                        .to.eql(sourceFiles.map(sourceFile => stubs.getPublicPath(sourceFile)));

                    done();
                })
                .catch(done);
        });

        it("warns if a path does not exist", (done) => {
            const testEntry = `${stubs.sourceDir}/non/existent/path.js`;
            const warningStub = `File does not exist: ${testEntry}`;
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                args: [
                    testEntry
                ],

                cpus: 1
            }));

            const handle = require("../../utils/handle")(commanderStub, stubs.wildcatOptions);

            expect(pathExists.sync(testEntry))
                .to.be.false;

            handle(testEntry)
                .then((warning) => {
                    expect(warning)
                        .to.exist;

                    expect(warning)
                        .to.be.a("string")
                        .that.equals(warningStub);

                    expect(pathExists.sync(stubs.getPublicPath(testEntry)))
                        .to.be.false;

                    expect(loggerStub.warn.lastCall)
                        .to.have.been.calledWith(
                            `File does not exist: ${testEntry}`
                        );

                    done();
                })
                .catch(done);
        });

        it("returns a stat error", (done) => {
            const testEntry = stubs.mainEntrySourcePath;
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                args: [
                    testEntry
                ],

                cpus: 1
            }));

            const handle = proxyquire("../../utils/handle", {
                "fs-extra": {
                    stat: (filename, cb) => cb(stubs.errorStub)
                }
            })(commanderStub, stubs.wildcatOptions);

            handle(testEntry)
                .catch((err) => {
                    expect(err)
                        .to.exist;

                    expect(err)
                        .to.be.an.instanceof(Error);

                    expect(err)
                        .to.eql(stubs.errorStub);

                    expect(loggerStub.error.lastCall)
                        .to.have.been.calledWith(
                            stubs.errorStub
                        );

                    done();
                });
        });

        it("returns a glob error", (done) => {
            const testEntry = `${stubs.sourceDir}/components/Application`;
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                args: [
                    testEntry
                ],

                cpus: 1
            }));

            const handle = proxyquire("../../utils/handle", {
                "glob": (pattern, options, cb) => cb(stubs.errorStub)
            })(commanderStub, stubs.wildcatOptions);

            handle(testEntry)
                .catch((err) => {
                    expect(err)
                        .to.exist;

                    expect(err)
                        .to.be.an.instanceof(Error);

                    expect(err)
                        .to.eql(stubs.errorStub);

                    done();
                });
        });

        it("returns a transpiler error", (done) => {
            const testEntry = stubs.mainEntrySourcePath;
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                args: [
                    testEntry
                ],

                cpus: 1
            }));

            const handle = proxyquire("../../utils/handle", {
                "./transpiler": () => (filename, cb) => cb(stubs.errorStub)
            })(commanderStub, stubs.wildcatOptions);

            handle(testEntry)
                .catch((err) => {
                    expect(err)
                        .to.exist;

                    expect(err)
                        .to.be.an.instanceof(Error);

                    expect(err)
                        .to.eql(stubs.errorStub);

                    done();
                });
        });
    });
};
