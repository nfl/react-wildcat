const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const proxyquire = require("proxyquire");

module.exports = stubs => {
    describe("webpackBundleValidation", () => {
        it("returns a validation object", () => {
            const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");
            const validate = webpackBundleValidation(stubs.exampleDir, {
                __DEV__: false,
                logger: stubs.logger,
                webpackDevSettings: stubs.devServerConfigFile
            });

            expect(validate).to.exist;

            expect(validate).to.be.an("object");

            expect(validate).to.respondTo("onReady");

            expect(validate).to.respondTo("ready");
        });

        context("onReady()", () => {
            it("waits for Webpack to be ready when the current bundle is invalid", () => {
                const loggerStub = sinon.stub(stubs.logger, "info").returns();

                const webpackBundleValidation = proxyquire(
                    "../../src/utils/webpackBundleValidation",
                    {
                        webpack: () => ({
                            watch() {}
                        })
                    }
                );

                const validate = webpackBundleValidation(stubs.exampleDir, {
                    __DEV__: true,
                    logger: stubs.logger,
                    webpackDevSettings: stubs.devServerConfigFile
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

                stubs.logger.info.restore();
            });

            it("validates the current bundle when ready", done => {
                const loggerStub = sinon.stub(stubs.logger, "info").returns();

                const webpackBundleValidation = proxyquire(
                    "../../src/utils/webpackBundleValidation",
                    {
                        webpack: () => ({
                            watch(opts, cb) {
                                setTimeout(() => {
                                    cb(null, stubs.stats);
                                });
                            }
                        })
                    }
                );

                const validate = webpackBundleValidation(stubs.exampleDir, {
                    __DEV__: true,
                    logger: stubs.logger,
                    webpackDevSettings: stubs.devServerConfigFile
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

                stubs.logger.info.restore();
            });

            it("returns callback in production mode", done => {
                const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");

                const validate = webpackBundleValidation(stubs.exampleDir, {
                    __DEV__: false,
                    logger: stubs.logger,
                    webpackDevSettings: stubs.devServerConfigFile
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

        context("ready()", () => {
            it("clears require cache of all Webpack-generated files", done => {
                const webpackBundleValidation = proxyquire(
                    "../../src/utils/webpackBundleValidation",
                    {
                        "clear-require": moduleName => {
                            expect(moduleName).to.be
                                .a("string")
                                .that.equals(stubs.webpackFileStub);

                            done();
                        }
                    }
                );

                const validate = webpackBundleValidation(stubs.exampleDir, {
                    __DEV__: false,
                    logger: stubs.logger,
                    webpackDevSettings: stubs.devServerConfigFile
                });

                validate._stats = {};

                validate.ready({
                    err: undefined,
                    stats: {
                        compilation: {
                            assets: {
                                "webpack-stub": {
                                    existsAt: stubs.webpackFileStub
                                }
                            }
                        }
                    }
                });
            });

            it("calls all pending handlers", done => {
                const webpackBundleValidation = require("../../src/utils/webpackBundleValidation");
                let handlerCount = 0;

                const validate = webpackBundleValidation(stubs.exampleDir, {
                    __DEV__: false,
                    logger: stubs.logger,
                    webpackDevSettings: stubs.devServerConfigFile
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
                    stats: stubs.stats
                });
            });
        });
    });
};
