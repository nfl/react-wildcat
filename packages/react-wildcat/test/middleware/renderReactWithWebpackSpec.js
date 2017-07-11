const chai = require("chai");
const expect = chai.expect;
const mockSinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const co = require("co");
const deepmerge = require("deepmerge");
const webpack = require("webpack");

module.exports = mockStubs => {
    describe("renderReactWithWebpack", () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        const wildcatConfig = require("../../src/utils/getWildcatConfig")(
            mockStubs.exampleDir
        );
        let staticServer;

        const loggerStub = {};

        beforeAll(done => {
            jest.resetModules();

            const compiler = webpack(require(mockStubs.prodConfigFile));

            compiler.run(err => {
                if (err) {
                    done(err);
                }

                Object.keys(mockStubs.logMethods).forEach(method => {
                    loggerStub[method] = mockSinon.stub(
                        mockStubs.logger,
                        method
                    );
                    loggerStub[method].returns();
                });

                mockSinon.stub(console, "info").returns();

                jest.mock("cluster", () => {
                    return {
                        isMaster: false,
                        worker: {
                            id: 1
                        }
                    };
                });

                jest.mock("../../src/utils/logger.js", () => {
                    const NullLogger = mockStubs.Logger;
                    NullLogger.prototype = mockStubs.logger;

                    return NullLogger;
                });

                jest.mock("../../src/utils/getMorganOptions.js", () => {
                    return function () {
                        return {
                            skip: () => true,
                            stream: mockSinon.stub().returns()
                        };
                    };
                });

                staticServer = require("../../src/staticServer");

                staticServer.start().then(() => done());
            });
        });

        afterAll(done => {
            Object.keys(mockStubs.logMethods).forEach(method => {
                loggerStub[method].restore();
            });

            console.info.restore();
            staticServer.close();

            jest.unmock("cluster");
            jest.unmock("../../src/utils/logger.js");
            jest.unmock("../../src/utils/getMorganOptions.js");

            done();
        });

        beforeEach(() => {
            mockSinon.stub(console, "warn").returns();
        });

        afterEach(() => {
            jest.unmock("../../src/middleware/renderReactWithWebpack");
            jest.unmock("../../src/utils/webpackBundleValidation");
            console.warn.restore();
        });

        const renderTypes = [
            {
                name: "renders HTML",
                expectation: `<title data-react-helmet="true">Index Example</title>`,
                fresh: false,
                url: "/"
            },
            {
                name: "renders HTML on subsequent requests",
                expectation: `<title data-react-helmet="true">Index Example</title>`,
                fresh: false,
                url: "/"
            },
            {
                name: "returns error payload",
                expectation: "Not found",
                fresh: false,
                url: "/error"
            },
            {
                name: "redirects the page",
                expectation: "",
                fresh: false,
                url: "/redirect"
            }
        ];

        ["development", "production"].forEach(currentEnv => {
            describe(currentEnv, () => {
                const isCurrentlyProd = currentEnv === "production";

                renderTypes.forEach(render => {
                    it(render.name, done => {
                        const renderReactWithWebpack = require("../../src/middleware/renderReactWithWebpack")(
                            mockStubs.exampleDir,
                            {
                                logger: mockStubs.logger,
                                wildcatConfig: deepmerge(
                                    wildcatConfig,
                                    mockStubs.getEnvironment({
                                        NODE_ENV: currentEnv
                                    })
                                )
                            }
                        );

                        co(function*() {
                            return yield renderReactWithWebpack.call({
                                request: {
                                    header: {
                                        host: wildcatConfig.generalSettings
                                            .originUrl,
                                        "user-agent": "Mozilla/5.0"
                                    },
                                    fresh: render.fresh,
                                    url: render.url
                                },
                                redirect: () => "",
                                response: {
                                    get: () => Date.now(),
                                    status: null,
                                    type: "text/html",
                                    lastModified: null
                                }
                            });
                        })
                            .then(result => {
                                expect(result).to.be
                                    .a("string")
                                    .that.includes(render.expectation);

                                done();
                            })
                            .catch(done);
                    });
                });

                it("handles server errors", done => {
                    const renderReactWithWebpack = require("../../src/middleware/renderReactWithWebpack")(
                        mockStubs.exampleDir,
                        {
                            logger: mockStubs.logger,
                            wildcatConfig: deepmerge.all([
                                wildcatConfig,
                                mockStubs.getEnvironment({
                                    NODE_ENV: currentEnv
                                }),
                                {
                                    serverSettings: {
                                        displayBlueBoxOfDeath: !isCurrentlyProd
                                    }
                                }
                            ])
                        }
                    );

                    co(function*() {
                        return yield renderReactWithWebpack.call({
                            request: {
                                header: {
                                    host: wildcatConfig.generalSettings
                                        .originUrl,
                                    "user-agent": "Mozilla/5.0"
                                },
                                fresh: false,
                                url: "/error-example"
                            },
                            redirect: () => "",
                            response: {
                                get: () => Date.now(),
                                status: null,
                                type: "text/html",
                                lastModified: null
                            }
                        });
                    })
                        .then(result => {
                            expect(result).to.be
                                .a("string")
                                .that.includes(
                                    "TypeError: this.props is not a function"
                                );

                            done();
                        })
                        .catch(done);
                });

                it("handles validation errors", done => {
                    jest.mock("../../src/utils/webpackBundleValidation", () => {
                        return function () {
                            return {
                                onReady: cb => cb(mockStubs.errorStub)
                            };
                        };
                    });

                    const renderReactWithWebpack = require("../../src/middleware/renderReactWithWebpack")(
                        mockStubs.exampleDir,
                        {
                            logger: mockStubs.logger,
                            wildcatConfig: deepmerge.all([
                                wildcatConfig,
                                mockStubs.getEnvironment({
                                    NODE_ENV: currentEnv
                                }),
                                {
                                    serverSettings: {
                                        displayBlueBoxOfDeath: !isCurrentlyProd
                                    }
                                }
                            ])
                        }
                    );

                    co(function*() {
                        return yield renderReactWithWebpack.call({
                            request: {
                                header: {
                                    host: wildcatConfig.generalSettings
                                        .originUrl,
                                    "user-agent": "Mozilla/5.0"
                                },
                                fresh: false,
                                url: "/"
                            },
                            redirect: () => "",
                            response: {
                                get: () => Date.now(),
                                status: null,
                                type: "text/html",
                                lastModified: null
                            }
                        });
                    })
                        .then(result => {
                            expect(result).to.include(
                                mockStubs.errorStub.message
                            );

                            done();
                        })
                        .catch(done);
                });
            });
        });

        it("handles Webpack bundle errors", done => {
            jest.mock("../../src/utils/webpackBundleValidation", () => {
                return function () {
                    return {
                        onReady: cb => cb(mockStubs.statsWithErrors)
                    };
                };
            });

            const renderReactWithWebpack = require("../../src/middleware/renderReactWithWebpack")(
                mockStubs.exampleDir,
                {
                    logger: mockStubs.logger,
                    wildcatConfig: deepmerge.all([
                        wildcatConfig,
                        mockStubs.getEnvironment({
                            NODE_ENV: "development"
                        }),
                        {
                            serverSettings: {
                                displayBlueBoxOfDeath: true
                            }
                        }
                    ])
                }
            );

            co(function*() {
                return yield renderReactWithWebpack.call({
                    request: {
                        header: {
                            host: wildcatConfig.generalSettings.originUrl,
                            "user-agent": "Mozilla/5.0"
                        },
                        fresh: false,
                        url: "/"
                    },
                    redirect: () => "",
                    response: {
                        get: () => Date.now(),
                        status: null,
                        type: "text/html",
                        lastModified: null
                    }
                });
            })
                .then(result => {
                    expect(result).to.include(mockStubs.errorStub.message);

                    done();
                })
                .catch(done);
        });
    });
};
