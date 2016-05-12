const fs = require("fs-extra");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const path = require("path");
const pathExists = require("path-exists");
const proxyquire = require("proxyquire");

module.exports = (stubs) => {
    "use strict";

    describe("createImportableModule", () => {
        afterEach(() => {
            [
                stubs.binDir,
                stubs.publicDir
            ].forEach(fs.removeSync);
        });

        [{
            name: "creates an importable module from a binary file",
            importOptions: stubs.importBinaryDefaults
        }, {
            name: "does not log output if logLevel is under 1",
            importOptions: Object.assign({}, stubs.importBinaryDefaults, {
                logLevel: 0
            })
        }, {
            name: "does not save Promise to a cache if temporaryCache setting is falsy",
            importOptions: Object.assign({}, stubs.importBinaryDefaults, {
                temporaryCache: undefined
            })
        }, {
            name: "does not copy the source binary file if binaryToModule setting is falsy",
            importOptions: Object.assign({}, stubs.importBinaryDefaults, {
                binaryToModule: undefined
            })
        }].forEach(test => {
            it(test.name, (done) => {
                const createImportableModule = require("../../src/utils/createImportableModule");
                const bodyContents = `module.exports = "${stubs.origin}${stubs.getBinPath(stubs.exampleBinaryPath)}";`;

                const loggerMetaStub = sinon.stub(stubs.logger, "meta");
                loggerMetaStub.returns();

                new Promise((resolve, reject) => createImportableModule(test.importOptions, resolve, reject))
                    .then((response) => {
                        loggerMetaStub.restore();

                        if (!test.importOptions.binaryToModule) {
                            expect(response)
                                .to.not.exist;

                            expect(pathExists.sync(path.join(stubs.exampleDir, stubs.exampleBinaryPath)))
                                .to.be.false;

                            return done();
                        }

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
                            .that.is.a("number")
                            .that.equals(bodyContents.length);

                        expect(response)
                            .to.have.property("body")
                            .that.is.a("string")
                            .that.equals(bodyContents);

                        expect(response)
                            .to.have.property("status")
                            .that.is.a("number")
                            .that.equals(200);

                        expect(pathExists.sync(path.join(stubs.exampleDir, stubs.exampleBinaryPath)))
                            .to.be.true;

                        const binaryFileContents = fs.readFileSync(path.join(stubs.exampleDir, stubs.exampleBinaryPath), "utf8");

                        expect(binaryFileContents)
                            .to.be.a("string")
                            .that.equals(bodyContents);

                        return done();
                    })
                    .catch(done);
            });
        });

        [{
            name: "using a temporary cache",
            importOptions: Object.assign({}, stubs.importBinaryDefaults, {
                temporaryCache: new Map()
            })
        }, {
            name: "without a temporary cache",
            importOptions: Object.assign({}, stubs.importBinaryDefaults, {
                temporaryCache: undefined
            })
        }].forEach(test => {
            it(`returns an importable error ${test.name}`, (done) => {
                const createImportableModule = proxyquire("../../src/utils/createImportableModule", {
                    "fs-extra": {
                        createOutputStream: (targetPath) => {
                            const expectedPath = path.join(stubs.exampleDir, stubs.exampleBinaryPath);

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
                        createReadStream: () => {
                            const EventEmitter = require("events");
                            const emitter = new EventEmitter();

                            emitter.pipe = () => {};

                            return emitter;
                        }
                    }
                });

                const loggerErrorStub = sinon.stub(stubs.logger, "error");
                loggerErrorStub.returns();

                new Promise((resolve, reject) => createImportableModule(test.importOptions, resolve, reject))
                    .catch(reason => {
                        expect(reason)
                            .to.be.an.instanceof(Error);

                        expect(reason)
                            .to.equal(stubs.errorStub);

                        loggerErrorStub.restore();
                        done();
                    });
            });
        });

        [{
            name: "using a temporary cache",
            importOptions: Object.assign({}, stubs.importBinaryDefaults, {
                temporaryCache: new Map()
            })
        }, {
            name: "without a temporary cache",
            importOptions: Object.assign({}, stubs.importBinaryDefaults, {
                temporaryCache: undefined
            })
        }].forEach(test => {
            it(`returns a binary error ${test.name}`, (done) => {
                const createImportableModule = proxyquire("../../src/utils/createImportableModule", {
                    "fs-extra": {
                        createOutputStream: (targetPath) => {
                            const expectedPath = stubs.exampleBinarySourcePath;

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
                        createReadStream: (targetPath) => {
                            const expectedPath = path.join(stubs.exampleDir, stubs.exampleBinarySourcePath);

                            const EventEmitter = require("events");
                            const emitter = new EventEmitter();

                            emitter.pipe = (stream) => {
                                if (targetPath === expectedPath) {
                                    return setTimeout(() => stream.emit("error", stubs.errorStub), stubs.writeDelay);
                                }

                                return setTimeout(() => stream.emit("finish"), stubs.writeDelay);
                            };

                            return emitter;
                        }
                    }
                });

                const loggerErrorStub = sinon.stub(stubs.logger, "error");
                loggerErrorStub.returns();

                new Promise((resolve, reject) => createImportableModule(test.importOptions, resolve, reject))
                    .catch(reason => {
                        expect(reason)
                            .to.be.an.instanceof(Error);

                        expect(reason)
                            .to.equal(stubs.errorStub);

                        loggerErrorStub.restore();
                        done();
                    });
            });
        });
    });
};
