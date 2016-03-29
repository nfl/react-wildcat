"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const co = require("co");
const proxyquire = require("proxyquire");

module.exports = (stubs) => {
    "use strict";

    describe("renderReactWithJspm", function () {
        this.timeout(30000);

        const wildcatConfig = require("../../src/utils/getWildcatConfig")(stubs.exampleDir);
        let staticServer;

        const loggerStub = {};

        before((done) => {
            Object.keys(stubs.logMethods).forEach(method => {
                loggerStub[method] = sinon.stub(stubs.logger, method);
                loggerStub[method].returns();
            });

            staticServer = proxyquire("../../src/staticServer", {
                "cluster": {
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

            staticServer.start()
                .then(() => done());
        });

        after((done) => {
            Object.keys(stubs.logMethods).forEach(method => {
                loggerStub[method].restore();
            });

            done();
        });

        beforeEach(() => {
            sinon.stub(console, "warn").returns();
        });

        afterEach(() => {
            staticServer.close();
            console.warn.restore();
        });

        context("with asynchronous entry path", () => {
            const renderTypes = [{
                name: "renders HTML",
                expectation: `<title data-react-helmet="true">Index Example</title>`,
                fresh: false,
                url: "/"
            }, {
                name: "renders HTML on subsequent requests",
                expectation: `<title data-react-helmet="true">Index Example</title>`,
                fresh: false,
                url: "/"
            }, {
                name: "returns error payload",
                expectation: "Not found",
                fresh: false,
                url: "/error"
            }, {
                name: "redirects the page",
                expectation: "",
                fresh: false,
                url: "/redirect"
            }];

            ["development", "production"].forEach(currentEnv => {
                context(currentEnv, () => {
                    const isCurrentlyProd = (currentEnv === "production");

                    renderTypes.forEach((render) => {
                        it(render.name, (done) => {
                            const renderReactWithJspm = require("../../src/middleware/renderReactWithJspm")(stubs.exampleDir, {
                                logger: stubs.logger,
                                wildcatConfig: Object.assign({}, wildcatConfig, {
                                    serverSettings: Object.assign({}, wildcatConfig.serverSettings, {
                                        hotReloader: "react-wildcat-hot-reloader",
                                        hotReloadReporter: isCurrentlyProd ? () => {} : false,
                                        localPackageCache: isCurrentlyProd
                                    })
                                })
                            });

                            co(function* () {
                                return yield renderReactWithJspm.call({
                                    request: {
                                        header: {
                                            host: wildcatConfig.generalSettings.originUrl,
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
                                .then((result) => {
                                    expect(result)
                                        .to.be.a("string");

                                    done();
                                })
                                .catch(done);
                        });
                    });

                    it("uses a cached bootstrap on subsequent requests", (done) => {
                        const renderReactWithJspm = require("../../src/middleware/renderReactWithJspm")(stubs.exampleDir, {
                            logger: stubs.logger,
                            wildcatConfig: Object.assign({}, wildcatConfig, {
                                serverSettings: Object.assign({}, wildcatConfig.serverSettings, {
                                    hotReloader: "react-wildcat-hot-reloader",
                                    hotReloadReporter: isCurrentlyProd ? () => {} : false,
                                    localPackageCache: isCurrentlyProd
                                })
                            })
                        });

                        co(function* () {
                            return yield renderReactWithJspm.call({
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
                            .then(() => {
                                return co(function* () {
                                    return yield renderReactWithJspm.call({
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
                                });
                            })
                            .then((result) => {
                                expect(result)
                                    .to.be.a("string");

                                done();
                            })
                            .catch(done);
                    });

                    it("handles server errors", (done) => {
                        const renderReactWithJspm = require("../../src/middleware/renderReactWithJspm")(stubs.exampleDir, {
                            logger: stubs.logger,
                            wildcatConfig: Object.assign({}, wildcatConfig, {
                                serverSettings: {
                                    displayBlueBoxOfDeath: !isCurrentlyProd,
                                    entry: "stubEntry.js",
                                    hotReloader: false,
                                    hotReloadReporter: false,
                                    localPackageCache: isCurrentlyProd,
                                    renderHandler: "stubRenderHandler.js"
                                }
                            })
                        });

                        co(function* () {
                            return yield renderReactWithJspm.call({
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
                            .then((result) => {
                                expect(result)
                                    .to.be.a("string");

                                done();
                            })
                            .catch(done);
                    });
                });
            });
        });

        context("with no defined entry path", () => {
            it("renders HTML", (done) => {
                const renderReactWithJspm = require("../../src/middleware/renderReactWithJspm")(stubs.exampleDir, {
                    logger: stubs.logger,
                    wildcatConfig: Object.assign({}, wildcatConfig, {
                        serverSettings: Object.assign({}, wildcatConfig.serverSettings, {
                            entry: false,
                            logLevel: 0
                        })
                    })
                });

                co(function* () {
                    return yield renderReactWithJspm.call({
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
                    .then((result) => {
                        expect(result)
                            .to.be.a("string");

                        done();
                    })
                    .catch(done);
            });
        });
    });
};
