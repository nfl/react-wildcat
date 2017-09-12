const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const co = require("co");
const deepmerge = require("deepmerge");
const proxyquire = require("proxyquire").noPreserveCache();
const webpack = require("webpack");

module.exports = stubs => {
    describe("renderReactWithWebpack", function() {
        this.timeout(30000);

        const wildcatConfig = require("../../src/utils/getWildcatConfig")(
            stubs.exampleDir
        );
        let staticServer;

        const loggerStub = {};

        before(done => {
            const compiler = webpack(require(stubs.prodConfigFile));

            compiler.run(err => {
                if (err) {
                    done(err);
                }

                Object.keys(stubs.logMethods).forEach(method => {
                    loggerStub[method] = sinon.stub(stubs.logger, method);
                    loggerStub[method].returns();
                });

                sinon.stub(console, "info").returns();

                staticServer = proxyquire("../../src/staticServer", {
                    cluster: {
                        isMaster: false,
                        worker: {
                            id: 1
                        }
                    },
                    "./utils/logger": (() => {
                        const NullLogger = stubs.Logger;
                        NullLogger.prototype = stubs.logger;

                        return NullLogger;
                    })(),
                    "./utils/getMorganOptions": () => ({
                        skip: () => true,
                        stream: sinon.stub().returns()
                    })
                });

                staticServer.start().then(() => done());
            });
        });

        after(done => {
            Object.keys(stubs.logMethods).forEach(method => {
                loggerStub[method].restore();
            });

            console.info.restore();
            staticServer.close();
            done();
        });

        beforeEach(() => {
            sinon.stub(console, "warn").returns();
        });

        afterEach(() => {
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
            context(currentEnv, () => {
                const isCurrentlyProd = currentEnv === "production";

                renderTypes.forEach(render => {
                    it(render.name, done => {
                        const renderReactWithWebpack = require("../../src/middleware/renderReactWithWebpack")(
                            stubs.exampleDir,
                            {
                                logger: stubs.logger,
                                wildcatConfig: deepmerge(
                                    wildcatConfig,
                                    stubs.getEnvironment({
                                        NODE_ENV: currentEnv
                                    })
                                )
                            }
                        );

                        co(function*() {
                            return yield renderReactWithWebpack.call({
                                request: {
                                    header: {
                                        host:
                                            wildcatConfig.generalSettings
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
                                expect(result)
                                    .to.be.a("string")
                                    .that.includes(render.expectation);

                                done();
                            })
                            .catch(done);
                    });
                });

                it("handles server errors", done => {
                    const renderReactWithWebpack = require("../../src/middleware/renderReactWithWebpack")(
                        stubs.exampleDir,
                        {
                            logger: stubs.logger,
                            wildcatConfig: deepmerge.all([
                                wildcatConfig,
                                stubs.getEnvironment({
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
                                    host:
                                        wildcatConfig.generalSettings.originUrl,
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
                            expect(result)
                                .to.be.a("string")
                                .that.includes(
                                    "TypeError: this.props is not a function"
                                );

                            done();
                        })
                        .catch(done);
                });

                it("handles validation errors", done => {
                    const renderReactWithWebpack = proxyquire(
                        "../../src/middleware/renderReactWithWebpack",
                        {
                            "../utils/webpackBundleValidation": () => ({
                                onReady: cb => cb(stubs.errorStub)
                            })
                        }
                    )(stubs.exampleDir, {
                        logger: stubs.logger,
                        wildcatConfig: deepmerge.all([
                            wildcatConfig,
                            stubs.getEnvironment({
                                NODE_ENV: currentEnv
                            }),
                            {
                                serverSettings: {
                                    displayBlueBoxOfDeath: !isCurrentlyProd
                                }
                            }
                        ])
                    });

                    co(function*() {
                        return yield renderReactWithWebpack.call({
                            request: {
                                header: {
                                    host:
                                        wildcatConfig.generalSettings.originUrl,
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
                            expect(result).to.include(stubs.errorStub.message);

                            done();
                        })
                        .catch(done);
                });
            });
        });

        it("handles Webpack bundle errors", done => {
            const renderReactWithWebpack = proxyquire(
                "../../src/middleware/renderReactWithWebpack",
                {
                    "../utils/webpackBundleValidation": () => ({
                        onReady: cb => cb(null, stubs.statsWithErrors)
                    })
                }
            )(stubs.exampleDir, {
                logger: stubs.logger,
                wildcatConfig: deepmerge.all([
                    wildcatConfig,
                    stubs.getEnvironment({
                        NODE_ENV: "development"
                    }),
                    {
                        serverSettings: {
                            displayBlueBoxOfDeath: true
                        }
                    }
                ])
            });

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
                    expect(result).to.include(stubs.errorStub.message);

                    done();
                })
                .catch(done);
        });
    });
};
