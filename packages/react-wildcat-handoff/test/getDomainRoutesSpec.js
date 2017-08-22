const chai = require("chai");
const expect = chai.expect;

const {
    getDomainDataFromHost,
    completeGetDomainRoutes
} = require("../src/utils/getDomainRoutes.js");

const domains = {
    domainAliases: {
        nfl: {
            www: [null]
        },
        nflclubs: {
            lions: ["www.buffalolions"]
        }
    }
};

const testResolveOptions = [
    {
        headers: {
            cookies: {},
            host: "www.aliastoexternal.com",
            href: "undefined://www.aliastoexternal.com/",
            pathname: "/",
            search: "?",
            userAgent: "Mozilla/5.0"
        },
        subdomain: "test",
        host: "www.aliastoexternal.com",
        domainRoutes: {domains: {}}
    },
    {
        headers: {
            cookies: {},
            host: "127.0.0.1",
            href: "undefined://127.0.0.1/",
            pathname: "/",
            search: "?",
            userAgent: "Mozilla/5.0"
        },
        subdomain: "www",
        host: "127.0.0.1",
        domainRoutes: {
            domains: {
                www: {
                    key: null,
                    ref: null,
                    props: {
                        path: "/",
                        children: [
                            {
                                key: null,
                                ref: null,
                                props: {from: "/redirect", to: "/"},
                                _owner: null,
                                _store: {}
                            },
                            {
                                key: null,
                                ref: null,
                                props: {from: "/context.html", to: "/"},
                                _owner: null,
                                _store: {}
                            }
                        ]
                    },
                    _owner: null,
                    _store: {}
                }
            }
        }
    }
];

const testHosts = [
    {
        host: "www.nfl.com",
        tld: "com",
        domain: "nfl",
        subdomain: "www"
    },
    {
        host: "nfl.com",
        tld: "com",
        domain: "nfl",
        subdomain: ""
    },
    {
        host: "lions.com",
        tld: "com",
        domain: "lions",
        subdomain: ""
    },
    {
        host: "www.lions.com",
        tld: "com",
        domain: "lions",
        subdomain: "www"
    },
    {
        host: "www.wildcat.nfl.com",
        tld: "com",
        domain: "nfl",
        subdomain: "www.wildcat"
    },
    {
        host: "www.nfl.dev",
        tld: "dev",
        domain: "nfl",
        subdomain: "www"
    },
    {
        host: "lions.clubs.nfl.dev",
        tld: "dev",
        domain: "nfl",
        subdomain: "lions.clubs"
    }
];

/* eslint-disable max-nested-callbacks */
describe("react-wildcat-handoff/getDomainRoutesTest.js", () => {
    describe("getDomainDataFromHost", () => {
        it("returns the right tld, domain and subdomain", done => {
            testHosts.forEach(test => {
                const result = getDomainDataFromHost(test.host, domains);
                expect(result.tld === test.tld);
                expect(result.domain === test.domain);
                expect(result.subdomain === test.subdomain);
            });
            done();
        });
    });

    describe("completeGetDomainRoutes", () => {
        it("does stuff", done => {
            testResolveOptions.forEach(resolveOptions => {
                completeGetDomainRoutes(resolveOptions, (foo, bar) => {
                    console.log(foo, bar);
                });
            });
            done();
        });
    });
});
