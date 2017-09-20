const chai = require("chai");
const expect = chai.expect;

const server = require("../src/server.js");
const stubs = require("./stubFixtures.js");

/* eslint-disable max-nested-callbacks */
describe("react-wildcat-handoff/server", () => {
    it("exists", () => {
        expect(server).to.exist;

        expect(server)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("server");
    });

    describe("response", () => {
        it("returns 301 when a redirect is detected", done => {
            const serverHandoff = server(stubs.routes.sync);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.redirect,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("redirect").that.is.true;

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

            expect(result).to.be.an.instanceof(Promise);
        });

        it("returns 404 when a route is not found", done => {
            const serverHandoff = server(stubs.routes.sync);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.invalid,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            )
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

            expect(result).to.be.an.instanceof(Promise);
        });

        it("returns custom 404 when a route is not found", done => {
            const serverHandoff = server(stubs.routes.sync);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.invalid,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfigWithHtmlNotFoundTemplate
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.equals(
                            "<html><h1>Custom 404 Template</h1></html>"
                        );

                    expect(response)
                        .to.be.an("object")
                        .that.has.property("status")
                        .that.equals(404);

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });

        it("returns 404 with an undefined ip address alias", done => {
            const serverHandoff = server(stubs.domains.domainAliasesUndefined);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.ip,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            )
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

            expect(result).to.be.an.instanceof(Promise);
        });

        it("returns 500 when an unknown error occurs", done => {
            const serverHandoff = server(stubs.invalidRoutes.sync);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.basic,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            ).catch(error => {
                expect(error).to.exist;

                expect(error)
                    .to.be.an("error")
                    .that.equals(stubs.callbackError);

                done();
            });

            expect(result).to.be.an.instanceof(Promise);
        });

        describe("markup", () => {
            it("returns HTML on a valid route", done => {
                const serverHandoff = server(stubs.routes.sync);

                expect(serverHandoff)
                    .to.be.a("function")
                    .that.has.property("name")
                    .that.equals("serverHandoff");

                const result = serverHandoff(
                    stubs.requests.basic,
                    stubs.response,
                    stubs.cookieParser,
                    stubs.wildcatConfig
                )
                    .then(response => {
                        expect(response)
                            .to.be.an("object")
                            .that.has.property("html")
                            .that.is.a("string");

                        done();
                    })
                    .catch(error => done(error));

                expect(result).to.be.an.instanceof(Promise);
            });

            it("returns HTML as static markup", done => {
                const serverHandoff = server(stubs.routes.sync);

                expect(serverHandoff)
                    .to.be.a("function")
                    .that.has.property("name")
                    .that.equals("serverHandoff");

                const result = serverHandoff(
                    stubs.requests.basic,
                    stubs.response,
                    stubs.cookieParser,
                    stubs.wildcatConfigRenderType
                )
                    .then(response => {
                        expect(response)
                            .to.be.an("object")
                            .that.has.property("html")
                            .that.is.a("string");

                        done();
                    })
                    .catch(error => done(error));

                expect(result).to.be.an.instanceof(Promise);
            });
        });
    });

    describe("routing", () => {
        describe("matches routes", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.routes[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.basic,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });

            it("handles async route errors", done => {
                const serverHandoff = server(stubs.invalidRoutes.async);

                expect(serverHandoff)
                    .to.be.a("function")
                    .that.has.property("name")
                    .that.equals("serverHandoff");

                const result = serverHandoff(
                    stubs.requests.basic,
                    stubs.response,
                    stubs.cookieParser,
                    stubs.wildcatConfig
                )
                    .then(null, error => {
                        expect(error).to.exist;

                        expect(error)
                            .to.be.an("error")
                            .that.equals(stubs.callbackError);

                        done();
                    })
                    .catch(error => done(error));

                expect(result).to.be.an.instanceof(Promise);
            });
        });

        describe("matches subdomains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.basic,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches multi subdomains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.multiSubdomain,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches ephemeral subdomains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.ephemeral,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches regex domains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.regexDomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.clubs,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            expect(response.status).to.equal(200);

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);

                    const result2 = serverHandoff(
                        stubs.requests.prodClub,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            expect(response.status).to.equal(200);

                            done();
                        })
                        .catch(error => done(error));

                    expect(result2).to.be.an.instanceof(Promise);

                    const result3 = serverHandoff(
                        stubs.requests.stageClub,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            expect(response.status).to.equal(200);

                            done();
                        })
                        .catch(error => done(error));

                    expect(result3).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("handles subdomain matching errors", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.invalidSubdomain,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
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

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("defaults to www when no subdomain is provided", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.subdomains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.noSubdomain,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            expect(response.status).to.equal(200);

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("handles unwrapped subdomains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(
                        stubs.unwrappedDomains[timing]
                    );

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.noSubdomain,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("handles non-aliased subdomains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(
                        stubs.domainsWithoutAliasedSubdomains[timing]
                    );

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.noSubdomain,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches domains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.domains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.basic,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches domain aliases", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.domains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.ip,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches correct alias with multiple domain aliases", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(
                        stubs.domainsWithMultipleAliases[timing]
                    );

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.basic,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches correct alias with multiple domain aliases", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(
                        stubs.domainsWithMultipleAliases[timing]
                    );

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.external,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches domain aliases with host name", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const serverHandoff = server(stubs.domains[timing]);

                    expect(serverHandoff)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("serverHandoff");

                    const result = serverHandoff(
                        stubs.requests.hostname,
                        stubs.response,
                        stubs.cookieParser,
                        stubs.wildcatConfig
                    )
                        .then(response => {
                            expect(response)
                                .to.be.an("object")
                                .that.has.property("html")
                                .that.is.a("string");

                            done();
                        })
                        .catch(error => done(error));

                    expect(result).to.be.an.instanceof(Promise);
                });
            });
        });

        it("resolves to host with undefined alias", done => {
            const serverHandoff = server(stubs.domains.domainAliasesUndefined);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.basic,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string");

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });

        it("resolves to host with a string domain alias", done => {
            const serverHandoff = server(stubs.domains.domainAliasesStringOnly);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.ip,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string");

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });

        it("resolves to host with a string domain alias", done => {
            const serverHandoff = server(stubs.domainsWithMultipleAliases.sync);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.external,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string");

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });

        it("handles matching errors", done => {
            const serverHandoff = server(stubs.invalidDomains.async);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.err,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            ).catch(e => {
                expect(e).to.be.an.instanceof(Error);
                done();
            });

            expect(result).to.be.an.instanceof(Promise);
        });
    });

    describe("prefetch", () => {
        it("returns a hydrated HTML payload", done => {
            const serverHandoff = server(stubs.prefetchedRoutes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.basic,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string")
                        .that.has.string(stubs.hydratedPayload);

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });
    });

    describe("not-found", () => {
        it("returns a 404 status", done => {
            const serverHandoff = server(stubs.notFoundRoute);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.basic,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfig
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("status")
                        .that.is.a("number")
                        .that.equals(404);

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });
    });

    describe("service worker", () => {
        it("renders when it's enabled under https", done => {
            const serverHandoff = server(stubs.prefetchedRoutes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.basic,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfigServiceWorkerEnabled
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string")
                        .that.has.string(stubs.serviceWorkerPayload);

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });
        it("does not render when it's enabled under http", done => {
            const serverHandoff = server(stubs.prefetchedRoutes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.basic,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfigServiceWorkerEnabledNoHttps
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string")
                        .and.not.have.string(stubs.serviceWorkerPayload);

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });
        it("does not render when it's disabled", done => {
            const serverHandoff = server(stubs.prefetchedRoutes);

            expect(serverHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("serverHandoff");

            const result = serverHandoff(
                stubs.requests.basic,
                stubs.response,
                stubs.cookieParser,
                stubs.wildcatConfigServiceWorkerDisabled
            )
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string")
                        .and.not.have.string(stubs.serviceWorkerPayload);

                    done();
                })
                .catch(error => done(error));

            expect(result).to.be.an.instanceof(Promise);
        });
    });
});
