"use strict";

const co = require("co");
const cp = require("child_process");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

const cwd = process.cwd();
const path = require("path");

const proxyquire = require("proxyquire");

/* eslint-disable max-nested-callbacks */
describe("react-wildcat", () => {
    const exampleDir = path.join(cwd, "example");

    before(() => {
        process.chdir(exampleDir);
    });

    context("polyfills", () => {
        context("fetch", () => {
            const fetch = require("../src/utils/fetch.js");

            it("adds fetch polyfill", () => {
                expect(fetch)
                    .to.exist;

                expect(global.fetch)
                    .to.be.a("function")
                    .that.equals(fetch);
            });

            context("fetches data", () => {
                before(() => {
                    sinon.stub(global, "fetch");
                    global.fetch.returns(Promise.resolve());
                });

                it("return valid data", (done) => {
                    fetch("http://example.com", {})
                        .then(() => done());
                });

                it("compensates for missing protocol", (done) => {
                    fetch("//example.com")
                        .then(() => done());
                });

                after(() => {
                    global.fetch.restore();
                });
            });
        });

        context("baseURI", () => {
            it("adds baseURI polyfill", () => {
                const baseURI = require("../src/utils/baseURI.js");

                expect(baseURI)
                    .to.exist;

                expect(global.baseURI)
                    .to.be.a("string")
                    .that.equals(baseURI);
            });
        });
    });

    context("middleware", () => {
        context("proxy", () => {
            const stubHeaderKeys = [
                "accept-ranges",
                "cache-control",
                "content-type",
                "content-length",
                "connection",
                "date",
                "etag",
                "expires",
                "last-modified",
                "server",
                "transfer-encoding",
                "x-cache",
                "x-ec-custom-error"
            ];

            const proxyTypes = [{
                name: "proxies a route to an external endpoint",
                route: "/static",
                expectation: (stubHeaders) => {
                    expect(stubHeaders)
                        .to.have.any.keys(stubHeaderKeys);
                }
            }, {
                name: "yields on an unmatched route",
                route: "/",
                expectation: (stubHeaders) => {
                    expect(stubHeaders)
                        .to.not.have.any.keys(stubHeaderKeys);
                }
            }];

            proxyTypes.forEach((proxyType) => {
                it(proxyType.name, (done) => {
                    const stubHeaders = {};

                    const proxy = proxyquire("../src/middleware/proxy", {})({
                        "/static": "http://example.com/static"
                    }, {
                        logger: {
                            info: () => {},
                            meta: () => {},
                            ok: () => {},
                            warn: () => {}
                        }
                    });

                    co(function* () {
                        try {
                            const result = yield proxy.call({
                                request: {
                                    url: proxyType.route
                                },
                                set: (header, value) => {
                                    stubHeaders[header] = value;
                                }
                            }, (next) => next());

                            return result;
                        } catch (e) {
                            return Promise.reject(e);
                        }
                    })
                        .then(() => {
                            proxyType.expectation(stubHeaders);
                            done();
                        })
                        .catch(e => done(e));
                });
            });
        });

        context("renderReactWithJSPM", function () {
            this.timeout(30000);

            const nodeEnv = process.env.NODE_ENV;
            const wildcatConfig = require("../src/utils/getWildcatConfig")(exampleDir);
            const currentLogLevel = wildcatConfig.generalSettings.logLevel;
            let staticServer;

            beforeEach((done) => {
                sinon.stub(console, "log");
                console.log.returns();

                sinon.stub(console, "info");
                console.info.returns();

                sinon.stub(console, "warn");
                console.warn.returns();

                process.env.LOG_LEVEL = 0;

                staticServer = proxyquire("../src/staticServer.js", {
                    "cluster": {
                        isMaster: false,
                        worker: {
                            id: 1
                        }
                    },
                    "./utils/getWildcatConfig": () => {
                        const config = Object.assign({}, wildcatConfig);
                        config.generalSettings.logLevel = 0;

                        return config;
                    },
                    "./utils/logger": () => {
                        function Logger() {}

                        Logger.prototype = {
                            info: () => {},
                            meta: () => {},
                            ok: () => {},
                            warn: () => {}
                        };

                        return Logger;
                    }()
                });

                staticServer.start()
                    .then(() => done());
            });

            afterEach((done) => {
                staticServer.close()
                    .then(() => {
                        console.log.restore();
                        console.info.restore();
                        console.warn.restore();

                        process.env.LOG_LEVEL = currentLogLevel;
                        done();
                    });
            });

            context("with asynchronous entry path", () => {
                const stubResponses = {
                    "200": {
                        type: "text/html",
                        status: 200,
                        redirect: false
                    },

                    "301": {
                        redirect: true,
                        redirectLocation: {
                            pathname: "/redirect",
                            search: ""
                        }
                    },

                    "304": {
                        type: "text/html",
                        status: 200,
                        redirect: false,
                        html: "<div>cached HTML stub</div>"
                    },

                    "404": {
                        type: "text/json",
                        status: 404,
                        redirect: false
                    }
                };

                const renderTypes = [{
                    name: "renders HTML",
                    cache: {},
                    fresh: false,
                    reply: {
                        reply: stubResponses["200"]
                    },
                    url: "/"
                }, {
                    name: "returns HTML from cache",
                    cache: {
                        "/": {
                            cache: stubResponses["304"]
                        }
                    },
                    fresh: true,
                    reply: {
                        reply: stubResponses["304"]
                    },
                    url: "/"
                }, {
                    name: "returns error payload",
                    cache: {},
                    fresh: false,
                    reply: {
                        reply: stubResponses["404"]
                    },
                    url: "/error"
                }, {
                    name: "redirects the page",
                    cache: {},
                    fresh: false,
                    reply: {
                        reply: stubResponses["301"]
                    },
                    url: "/redirect"
                }];

                ["development", "production"].forEach(currentEnv => {
                    context(currentEnv, () => {
                        before(() => {
                            process.env.NODE_ENV = currentEnv;
                            wildcatConfig.generalSettings.logLevel = 0;
                        });

                        renderTypes.forEach((render) => {
                            it(render.name, (done) => {
                                const renderReactWithJSPM = require("../src/middleware/renderReactWithJSPM")(exampleDir, {
                                    cache: render.cache,
                                    wildcatConfig
                                });

                                co(function* () {
                                    try {
                                        const result = yield renderReactWithJSPM.call({
                                            cookies: {
                                                get: () => "clientSize"
                                            },
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
                                                type: null,
                                                lastModified: null
                                            }
                                        });

                                        return result;
                                    } catch (e) {
                                        return Promise.reject(e);
                                    }
                                })
                                    .then((result) => {
                                        expect(result)
                                            .to.be.a("string");

                                        done();
                                    })
                                    .catch(e => done(e));
                            });
                        });

                        after(() => {
                            process.env.NODE_ENV = nodeEnv;
                            wildcatConfig.generalSettings.logLevel = currentLogLevel;
                        });
                    });
                });
            });

            context("with no defined entry path", () => {
                const existingEntry = wildcatConfig.serverSettings.entry;

                before(() => {
                    wildcatConfig.serverSettings.entry = false;
                    wildcatConfig.generalSettings.logLevel = 0;
                });

                it("renders HTML", (done) => {
                    const renderReactWithJSPM = require("../src/middleware/renderReactWithJSPM")(exampleDir, {
                        cache: {},
                        wildcatConfig
                    });

                    co(function* () {
                        try {
                            const result = yield renderReactWithJSPM.call({
                                cookies: {
                                    get: () => "clientSize"
                                },
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
                                    type: null,
                                    lastModified: null
                                }
                            });

                            return result;
                        } catch (e) {
                            return Promise.reject(e);
                        }
                    })
                        .then((result) => {
                            expect(result)
                                .to.be.a("string");

                            done();
                        })
                        .catch(e => done(e));
                });

                after(() => {
                    wildcatConfig.serverSettings.entry = existingEntry;
                    wildcatConfig.generalSettings.logLevel = currentLogLevel;
                });
            });
        });
    });

    context("app server", () => {
        const nodeEnv = process.env.NODE_ENV;

        const expectations = {
            "development": [
                "Proxy",
                "Node server is running at"
            ],
            "production": [
                "Node server is running"
            ],
            "production-with-proxies": [
                "Proxy",
                "Node server is running"
            ]
        };

        ["development", "production", "production-with-proxies"].forEach(currentEnv => {
            context(currentEnv, () => {
                before(() => {
                    if (currentEnv === "production-with-proxies") {
                        process.env.DANGEROUSLY_ENABLE_PROXIES_IN_PRODUCTION = "true";
                        process.env.NODE_ENV = "production";
                    } else {
                        process.env.NODE_ENV = currentEnv;
                    }
                });

                it("starts the server via cli", (done) => {
                    const currentExpectations = expectations[currentEnv];
                    let currentExpectationCount = 0;
                    let cli;

                    try {
                        cli = cp.spawn("node", [
                            path.join(cwd, "packages/react-wildcat/cli/wildcat.js")
                        ], {
                            stdio: "pipe"
                        });

                        cli.stdout.setEncoding("utf8");

                        cli.stdout.on("data", (data) => {
                            const expectationMatch = currentExpectations.some(exp => data.includes(exp));

                            if (expectationMatch) {
                                expect(expectationMatch).to.be.true;
                                currentExpectationCount++;
                            }

                            expect(cli.killed)
                                .to.be.false;

                            if (currentExpectationCount >= currentExpectations.length) {
                                cli.kill("SIGINT");

                                expect(cli.killed)
                                    .to.be.true;

                                setTimeout(() => done(), 250);
                            }
                        });
                    } catch (e) {
                        cli && cli.kill && cli.kill("SIGINT");
                        done(e);
                    }
                });

                ["http2", "https", "http"].forEach(currentProtocol => {
                    context(currentProtocol, () => {
                        it("starts the server programmatically", (done) => {
                            const server = proxyquire("../src/server.js", {
                                "cluster": {
                                    isMaster: false,
                                    worker: {
                                        id: 1
                                    }
                                },
                                "./utils/getWildcatConfig": () => {
                                    const defaultConfig = require("../src/utils/getWildcatConfig")();
                                    defaultConfig.serverSettings.appServer.protocol = currentProtocol;

                                    return defaultConfig;
                                },
                                "./utils/logger": () => {
                                    function Logger() {}

                                    Logger.prototype = {
                                        info: () => {},
                                        meta: () => {},
                                        ok: () => {},
                                        warn: () => {}
                                    };

                                    return Logger;
                                }()
                            });

                            expect(server)
                                .to.exist;

                            expect(server)
                                .to.respondTo("start");

                            expect(server.start)
                                .to.be.a("function");

                            server.start()
                                .then((result) => {
                                    expect(result)
                                        .to.exist;

                                    expect(result)
                                        .to.be.an("object")
                                        .that.has.property("env")
                                        .that.equals(process.env.NODE_ENV);

                                    server.close()
                                        .then(() => done());
                                });
                        });
                    });
                });

                after(() => {
                    if (currentEnv === "production-with-proxies") {
                        process.env.DANGEROUSLY_ENABLE_PROXIES_IN_PRODUCTION = undefined;
                    }

                    process.env.NODE_ENV = nodeEnv;
                });
            });
        });
    });

    after(() => {
        process.chdir(cwd);
    });
});
