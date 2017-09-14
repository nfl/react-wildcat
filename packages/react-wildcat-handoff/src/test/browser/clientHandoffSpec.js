import client from "../../client.js";
import defaultTemplate from "../../utils/defaultTemplate.js";
import * as stubs from "../../../test/stubFixtures.js";

import {expect} from "chai";

const __REACT_ROOT_ID__ = stubs.__REACT_ROOT_ID__;

/* eslint-disable max-nested-callbacks */
describe("react-wildcat-handoff/client", () => {
    beforeAll(() => {
        window[__REACT_ROOT_ID__] =
            stubs.wildcatConfig.clientSettings.reactRootElementID;
        document.body.innerHTML = defaultTemplate({
            data: {},
            head: {
                htmlAttributes: {
                    toString: () => ""
                },
                link: {
                    toString: () => ""
                },
                meta: {
                    toString: () => ""
                },
                title: {
                    toString: () => ""
                }
            },
            html: "",
            wildcatConfig: stubs.wildcatConfig
        });
    });

    it("exists", () => {
        expect(client).to.exist;

        expect(client)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("client");
    });

    describe("routing", () => {
        describe("matches routes", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const clientHandoff = client(stubs.routes[timing])
                        .then(([response]) => {
                            expect(response).to.exist;

                            expect(response)
                                .to.be.an.instanceof(HTMLDivElement)
                                .that.has.property("id")
                                .that.equals(
                                    stubs.wildcatConfig.clientSettings
                                        .reactRootElementID
                                );

                            expect(response)
                                .to.have.property("dataset")
                                .that.is.an.instanceof(DOMStringMap)
                                .that.has.property("reactAvailable")
                                .that.equals("true");

                            done();
                        })
                        .catch(error => done(error));

                    expect(clientHandoff).to.be.an.instanceof(Promise);
                });
            });

            it("handles async route errors", done => {
                const clientHandoff = client(stubs.invalidRoutes.async)
                    .then(null, error => {
                        expect(error).to.be.an.instanceof(Error);
                        done();
                    })
                    .catch(error => done(error));

                expect(clientHandoff).to.be.an.instanceof(Promise);
            });
        });

        describe("matches subdomains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const clientHandoff = client(stubs.subdomains[timing])
                        .then(([response]) => {
                            expect(response).to.exist;

                            expect(response)
                                .to.be.an.instanceof(HTMLDivElement)
                                .that.has.property("id")
                                .that.equals(
                                    stubs.wildcatConfig.clientSettings
                                        .reactRootElementID
                                );

                            expect(response)
                                .to.have.property("dataset")
                                .that.is.an.instanceof(DOMStringMap)
                                .that.has.property("reactAvailable")
                                .that.equals("true");

                            done();
                        })
                        .catch(error => done(error));

                    expect(clientHandoff).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("handles unwrapped subdomains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const clientHandoff = client(stubs.unwrappedDomains[timing])
                        .then(([response]) => {
                            expect(response).to.exist;

                            expect(response)
                                .to.be.an.instanceof(HTMLDivElement)
                                .that.has.property("id")
                                .that.equals(
                                    stubs.wildcatConfig.clientSettings
                                        .reactRootElementID
                                );

                            expect(response)
                                .to.have.property("dataset")
                                .that.is.an.instanceof(DOMStringMap)
                                .that.has.property("reactAvailable")
                                .that.equals("true");

                            done();
                        })
                        .catch(error => done(error));

                    expect(clientHandoff).to.be.an.instanceof(Promise);
                });
            });
        });

        describe("matches domains", () => {
            ["async", "sync"].forEach(timing => {
                it(timing, done => {
                    const clientHandoff = client(stubs.domains[timing])
                        .then(([response]) => {
                            expect(response).to.exist;

                            expect(response)
                                .to.be.an.instanceof(HTMLDivElement)
                                .that.has.property("id")
                                .that.equals(
                                    stubs.wildcatConfig.clientSettings
                                        .reactRootElementID
                                );

                            expect(response)
                                .to.have.property("dataset")
                                .that.is.an.instanceof(DOMStringMap)
                                .that.has.property("reactAvailable")
                                .that.equals("true");

                            done();
                        })
                        .catch(error => done(error));

                    expect(clientHandoff).to.be.an.instanceof(Promise);
                });
            });
        });

        it("handles matching errors", done => {
            const clientHandoff = client(stubs.invalidDomains.async)
                .then(null, error => {
                    expect(error).to.be.an.instanceof(Error);
                    done();
                })
                .catch(error => done(error));

            expect(clientHandoff).to.be.an.instanceof(Promise);
        });
    });
});
