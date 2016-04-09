"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const resolve = require("resolve");

const proxyquire = require("proxyquire");
const pathExists = require("path-exists");

module.exports = (stubs, stubLogger) => {
    "use strict";

    describe("handleFile", () => {
        it("transpiles a source file", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const handleFile = require("../../utils/handleFile")(commanderStub, stubs.wildcatOptions);

            handleFile(stubs.mainEntrySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.mainEntrySourcePath)))
                    .to.be.true;

                done();
            });
        });

        it("creates an importable module from a binary file", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const handleFile = require("../../utils/handleFile")(commanderStub, stubs.wildcatOptions);

            handleFile(stubs.exampleBinarySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.exampleBinarySourcePath)))
                    .to.be.true;

                expect(pathExists.sync(stubs.getBinPath(stubs.exampleBinarySourcePath)))
                    .to.be.true;

                done();
            });
        });

        it("ignores binary files when --copy-files flag is falsy", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                copyFiles: undefined
            }));
            const handleFile = require("../../utils/handleFile")(commanderStub, stubs.wildcatOptions);

            handleFile(stubs.exampleBinarySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.exampleBinarySourcePath)))
                    .to.be.false;

                expect(pathExists.sync(stubs.getBinPath(stubs.exampleBinarySourcePath)))
                    .to.be.false;

                done();
            });
        });

        it("logs output when --quiet is falsy", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, {
                quiet: undefined
            }));
            const handleFile = proxyquire("../../utils/handleFile", {
                [require.resolve("../../../src/utils/logger")]: (() => {
                    const StubLogger = stubs.Logger;
                    StubLogger.prototype = stubLogger;

                    return StubLogger;
                })()
            })(commanderStub, stubs.wildcatOptions);

            handleFile(stubs.exampleBinarySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.exampleBinarySourcePath)))
                    .to.be.true;

                expect(pathExists.sync(stubs.getBinPath(stubs.exampleBinarySourcePath)))
                    .to.be.true;

                expect(stubLogger.meta.lastCall)
                    .to.have.been.calledWith(
                        `${stubs.exampleBinarySourcePath} -> ${stubs.getPublicPath(stubs.exampleBinarySourcePath)}`
                    );

                done();
            });
        });

        it("finds local Babel module if not defined", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const handleFile = require("../../utils/handleFile")(commanderStub, Object.assign({}, stubs.wildcatOptions, {
                babel: undefined
            }));

            handleFile(stubs.mainEntrySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.mainEntrySourcePath)))
                    .to.be.true;

                done();
            });
        });

        it("re-uses found Babel module on subsequent calls", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const handleFile = require("../../utils/handleFile")(commanderStub, Object.assign({}, stubs.wildcatOptions, {
                babel: undefined
            }));

            handleFile(stubs.mainEntrySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.mainEntrySourcePath)))
                    .to.be.true;

                done();
            });
        });

        it("uses react-wildcat/node_modules/babel if project Babel is not found", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const handleFile = proxyquire("../../utils/handleFile", {
                "resolve": {
                    sync: () => resolve.sync("noop")
                }
            })(commanderStub, Object.assign({}, stubs.wildcatOptions, {
                babel: undefined
            }));

            handleFile(stubs.mainEntrySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.mainEntrySourcePath)))
                    .to.be.true;

                done();
            });
        });

        it("throws an error on other resolve errors", (done) => {
            try {
                const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
                const handleFile = proxyquire("../../utils/handleFile", {
                    "resolve": {
                        sync: () => {
                            throw stubs.errorStub;
                        }
                    }
                })(commanderStub, Object.assign({}, stubs.wildcatOptions, {
                    babel: undefined
                }));

                handleFile(stubs.mainEntrySourcePath);
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
};
