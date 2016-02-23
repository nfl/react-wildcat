"use strict";

const chai = require("chai");
const expect = chai.expect;

const server = require("../src/server.js");
const stubs = require("./stubFixtures.js");

const getClientSize = require("../src/utils/getClientSize.js");

/* eslint-disable max-nested-callbacks */
describe("react-wildcat-handoff/server", () => {
    it("exists", () => {
        expect(server).to.exist;

        expect(server)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("server");
    });

    context("response", () => {
        it("returns 301 when a redirect is detected", (done) => {
            const serverHandoff = server(stubs.routes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(stubs.requests.redirect, stubs.cookieParser, stubs.wildcatConfig)
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("redirect")
                        .that.is.true;

                    expect(response)
                        .to.be.an("object")
                        .that.has.property("status")
                        .that.equals(301);

                    expect(response)
                        .to.be.an("object")
                        .that.has.property("redirectLocation")
                        .that.is.an("object")
                        .that.has.keys([
                            "pathname",
                            "search",
                            "hash",
                            "state",
                            "action",
                            "key",
                            "query"
                        ]);

                    done();
                })
                .catch(error => done(error));

            expect(result)
                .to.be.an.instanceof(Promise);
        });

        it("returns 404 when a route is not found", (done) => {
            const serverHandoff = server(stubs.routes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(stubs.requests.invalid, stubs.cookieParser, stubs.wildcatConfig)
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("error")
                        .that.is.a("string");

                    expect(response)
                        .to.be.an("object")
                        .that.has.property("status")
                        .that.equals(404);

                    done();
                })
                .catch(error => done(error));

            expect(result)
                .to.be.an.instanceof(Promise);
        });

        it("returns 500 when an unknown error occurs", (done) => {
            const serverHandoff = server(stubs.invalidRoutes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                .catch(error => {
                    expect(error)
                        .to.exist;

                    expect(error)
                        .to.be.an("error")
                        .that.equals(stubs.callbackError);

                    done();
                });

            expect(result)
                .to.be.an.instanceof(Promise);
        });

        context("markup", () => {
            it("returns HTML on a valid route", (done) => {
                const serverHandoff = server(stubs.routes);

                expect(serverHandoff)
                    .to.be.a("function")
                    .that.has.property("name")
                    .that.equals("serverHandoff");

                const result = serverHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                    .then(response => {
                        expect(response)
                            .to.be.an("object")
                            .that.has.property("html")
                            .that.is.a("string");

                        done();
                    })
                    .catch(error => done(error));

                expect(result)
                    .to.be.an.instanceof(Promise);
            });

            it("adds a WebSocket listener on the client in development mode", (done) => {
                const existingEnv = process.env.NODE_ENV;
                process.env.NODE_ENV = "development";

                const serverHandoff = server(stubs.routes);

                expect(serverHandoff)
                    .to.be.a("function")
                    .that.has.property("name")
                    .that.equals("serverHandoff");

                const result = serverHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                    .then(response => {
                        expect(response)
                            .to.be.an("object")
                            .that.has.property("html")
                            .that.is.a("string")
                            .that.has.string(stubs.developmentPayload);

                        process.env.NODE_ENV = existingEnv;
                        done();
                    })
                    .catch(error => done(error));

                expect(result)
                    .to.be.an.instanceof(Promise);
            });
        });
    });

    context("routing", () => {
        it("matches routes", (done) => {
            const serverHandoff = server(stubs.routes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string");

                    done();
                })
                .catch(error => done(error));

            expect(result)
                .to.be.an.instanceof(Promise);
        });

        context("matches subdomains", () => {
            ["async", "sync"].forEach((timing) => {
                it(timing, (done) => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result)
                        .to.be.an.instanceof(Promise);
                });
            });
        });

        context("matches ephemeral subdomains", () => {
            ["async", "sync"].forEach((timing) => {
                it(timing, (done) => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(stubs.requests.ephemeral, stubs.cookieParser, stubs.wildcatConfig)
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result)
                        .to.be.an.instanceof(Promise);
                });
            });
        });

        context("handles subdomain matching errors", () => {
            ["async", "sync"].forEach((timing) => {
                it(timing, (done) => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(stubs.requests.invalidSubdomain, stubs.cookieParser, stubs.wildcatConfig)
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("error")
                                .that.is.a("string");

                            expect(response)
                                .to.be.an("object")
                                .that.has.property("status")
                                .that.equals(404);

                            done();
                        })
                        .catch(error => done(error));

                    expect(result)
                        .to.be.an.instanceof(Promise);
                });
            });
        });

        context("defaults to www when no subdomain is provided", () => {
            ["async", "sync"].forEach((timing) => {
                it(timing, (done) => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(stubs.requests.noSubdomain, stubs.cookieParser, stubs.wildcatConfig)
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result)
                        .to.be.an.instanceof(Promise);
                });
            });
        });

        context("handles unwrapped subdomains", () => {
            ["async", "sync"].forEach((timing) => {
                it(timing, (done) => {
                    const serverHandoff = server(stubs.unwrappedDomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(stubs.requests.noSubdomain, stubs.cookieParser, stubs.wildcatConfig)
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result)
                        .to.be.an.instanceof(Promise);
                });
            });
        });

        context("matches domains", () => {
            ["async", "sync"].forEach((timing) => {
                it(timing, (done) => {
                    const serverHandoff = server(stubs.domains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result)
                        .to.be.an.instanceof(Promise);
                });
            });
        });

        it("handles matching errors", (done) => {
            const serverHandoff = server(stubs.invalidDomains.async);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(stubs.requests.err, stubs.cookieParser, stubs.wildcatConfig)
                .catch(e => {
                    expect(e).to.be.an.instanceof(Error);
                    done();
                });

            expect(result)
                .to.be.an.instanceof(Promise);
        });
    });

    context("prefetch", () => {
        it("returns a hydrated HTML payload", (done) => {
            const serverHandoff = server(stubs.prefetchedRoutes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string")
                        .that.has.string(stubs.hydratedPayload);

                    done();
                })
                .catch(error => done(error));

            expect(result)
                .to.be.an.instanceof(Promise);
        });
    });

    context("matchMedia", () => {
        it("exists", () => {
            expect(getClientSize)
                .to.be.a("function")
                .that.has.property("name")
                .that.eql("getClientSize");
        });

        context("matches using client width / height", () => {
            it("using cookie data", () => {
                const clientSize = getClientSize(stubs.cookieParserWithValues, stubs.cookieData.values);

                expect(clientSize)
                    .to.be.an("object")
                    .that.eql(stubs.clientSize.values);
            });

            it("using query data", () => {
                const clientSize = getClientSize(stubs.cookieParser, stubs.cookieData.values);

                expect(clientSize)
                    .to.be.an("object")
                    .that.eql(stubs.clientSize.values);
            });
        });

        context("matches using client alias", () => {
            it("using cookie data", () => {
                const clientSize = getClientSize(stubs.cookieParserWithAlias, stubs.cookieData.alias);

                expect(clientSize)
                    .to.be.an("object")
                    .that.eql(stubs.clientSize.alias);
            });

            it("using query data", () => {
                const clientSize = getClientSize(stubs.cookieParser, stubs.cookieData.alias);

                expect(clientSize)
                    .to.be.an("object")
                    .that.eql(stubs.clientSize.alias);
            });
        });
    });
});
