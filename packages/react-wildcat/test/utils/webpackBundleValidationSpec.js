const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

module.exports = mockStubs => {
    describe("webpackBundleValidation", () => {
        it("returns a validation object", () => {
            const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");
            const validate = webpackBundleValidation(mockStubs.exampleDir, {
                __DEV__: false,
                logger: mockStubs.logger,
                webpackDevSettings: mockStubs.devServerConfigFile
            });

            expect(validate).to.exist;

            expect(validate).to.be.an("object");

            expect(validate).to.respondTo("onReady");

            expect(validate).to.respondTo("ready");
        });

        describe("onReady()", () => {
            let loggerStub;

            beforeEach(() => {
                jest.resetModules();
                loggerStub = sinon.stub(mockStubs.logger, "info").returns();
            });
            afterEach(() => {
                jest.unmock("webpack");
                mockStubs.logger.info.restore();
            });

            it("waits for Webpack to be ready when the current bundle is invalid", () => {
                jest.mock("webpack", () => {
                    return () => ({
                        watch() {}
                    });
                });

                const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");

                const validate = webpackBundleValidation(mockStubs.exampleDir, {
                    __DEV__: true,
                    logger: mockStubs.logger,
                    webpackDevSettings: mockStubs.devServerConfigFile
                });

                validate._watcher = {
                    invalid: true
                };

                function onReadyHandler() {}

                validate.onReady(onReadyHandler);

                expect(validate).to.have
                    .property("_handlers")
                    .that.is.an("array")
                    .that.includes(onReadyHandler);

                expect(loggerStub).to.have.been.calledWith(
                    "webpack: wait until bundle finished"
                );
            });

            it("validates the current bundle when ready", done => {
                jest.mock("webpack", () => {
                    return () => ({
                        watch(opts, cb) {
                            setTimeout(() => {
                                cb(null, mockStubs.stats);
                            });
                        }
                    });
                });

                const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");

                const validate = webpackBundleValidation(mockStubs.exampleDir, {
                    __DEV__: true,
                    logger: mockStubs.logger,
                    webpackDevSettings: mockStubs.devServerConfigFile
                });

                validate._watcher = {
                    invalid: true
                };

                function onReadyHandler(err, stats) {
                    expect(err).to.not.exist;

                    expect(stats).to.be.an("object");

                    done();
                }

                validate.onReady(onReadyHandler);

                expect(validate).to.have
                    .property("_handlers")
                    .that.is.an("array")
                    .that.includes(onReadyHandler);

                expect(loggerStub).to.have.been.calledWith(
                    "webpack: wait until bundle finished"
                );
            });

            it("returns callback in production mode", done => {
                const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");

                const validate = webpackBundleValidation(mockStubs.exampleDir, {
                    __DEV__: false,
                    logger: mockStubs.logger,
                    webpackDevSettings: mockStubs.devServerConfigFile
                });

                validate._stats = {};

                function onReadyHandler(err, stats) {
                    expect(err).to.not.exist;

                    expect(stats).to.exist;

                    done();
                }

                validate.onReady(onReadyHandler);
            });
        });

        describe("ready()", () => {
            it("clears require cache of all Webpack-generated files", done => {
                const mockExpect = expect;

                jest.mock("clear-require", () => {
                    mockExpect("webpack-stub.js").to.be
                        .a("string")
                        .that.equals(mockStubs.webpackFileStub);
                    return jest.genMockFromModule("clear-require");
                });

                const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");

                const validate = webpackBundleValidation(mockStubs.exampleDir, {
                    __DEV__: false,
                    logger: mockStubs.logger,
                    webpackDevSettings: mockStubs.devServerConfigFile
                });

                validate._stats = {};

                validate.ready({
                    err: undefined,
                    stats: {
                        compilation: {
                            assets: {
                                "webpack-stub": {
                                    existsAt: mockStubs.webpackFileStub
                                }
                            }
                        }
                    }
                });

                done();
            });

            it("calls all pending handlers", done => {
                const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");
                let handlerCount = 0;

                const validate = webpackBundleValidation(mockStubs.exampleDir, {
                    __DEV__: false,
                    logger: mockStubs.logger,
                    webpackDevSettings: mockStubs.devServerConfigFile
                });

                function firstHandlerStub() {
                    handlerCount++;

                    expect(handlerCount).to.equal(1);
                }

                function secondHandlerStub() {
                    handlerCount++;

                    expect(handlerCount).to.equal(2);

                    setTimeout(() => {
                        expect(validate._handlers).to.be.an("array").that.is
                            .empty;

                        done();
                    });
                }

                validate._handlers = [firstHandlerStub, secondHandlerStub];

                validate.ready({
                    err: undefined,
                    stats: mockStubs.stats
                });
            });
        });
    });
};
