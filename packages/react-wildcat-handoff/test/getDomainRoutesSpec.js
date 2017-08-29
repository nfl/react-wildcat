const chai = require("chai");
const expect = chai.expect;

const {
    getDomainDataFromHost,
    completeGetDomainRoutes,
    newGetDomainRoutes
} = require("../src/utils/getDomainRoutes.js");

// Might make sense to change the domain object and leverage
// this plugin: https://github.com/isaacs/node-glob
const newDomains = {
    globMatching: true,
    domainAliases: {},
    "*lions*[dev|com]": (foo, bar) => {
        console.log("Lions test callback: ", foo, bar);
    },
    "www.nfl.[dev|com]": (foo, bar) => {
        console.log("NFL test callback: ", foo, bar);
    }
};

const domains = {
    // domainAliases: {
    //     nfl: {
    //         www: [null]
    //     }
    //     // nflclubs: {
    //     //     lions: ["www.lions"]
    //     // },
    //     // lions: {
    //     //     www: ["lions.clubs"]
    //     // }
    // },
    nfl: {
        amp: (foo, bar) => {
            console.log(foo, bar);
        },
        www: (foo, bar) => {
            console.log(foo, bar);
        }
    },
    clubs: {
        lions: (foo, bar) => {
            console.log(foo, bar);
        },
        bills: (foo, bar) => {
            console.log(foo, bar);
        }
    }
};

const testResolveOptions = [
    {
        headers: {
            cookies: {},
            host: "lions.clubs.wildcat.nfl.com",
            href: "undefined://lions.clubs.wildcat.nfl.com/",
            method: undefined,
            pathname: "/",
            protocol: undefined,
            referrer: undefined,
            search: "?",
            userAgent: "Mozilla/5.0"
        },
        subdomain: "lions.wildcat.clubs",
        host: "lions.clubs.wildcat.nfl.com",
        domainRoutes: {domains: {}} // this was null
    },
    {
        headers: {
            cookies: {},
            host: "rams.clubs.wildcat.nfl.com",
            href: "undefined://rams.clubs.wildcat.nfl.com/",
            method: undefined,
            pathname: "/",
            protocol: undefined,
            referrer: undefined,
            search: "?",
            userAgent: "Mozilla/5.0"
        },
        subdomain: "rams.wildcat.clubs",
        host: "rams.clubs.wildcat.nfl.com",
        domainRoutes: {domains: {}} // this was null
    },
    {
        headers: {
            cookies: {},
            host: "detroitlions.com",
            href: "undefined://detroitlions.com/",
            method: undefined,
            pathname: "/",
            protocol: undefined,
            referrer: undefined,
            search: "?",
            userAgent: "Mozilla/5.0"
        },
        subdomain: "www",
        host: "detroitlions.com",
        domainRoutes: {domains: {}} // this was null
    },
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
        subdomain: "www"
    },
    // {
    //     host: "lions.com",
    //     tld: "com",
    //     domain: "clubs",
    //     subdomain: "lions"
    // },
    // {
    //     host: "www.lions.com",
    //     tld: "com",
    //     domain: "clubs",
    //     subdomain: "lions"
    // },
    {
        host: "www.wildcat.nfl.com",
        tld: "com",
        domain: "nfl",
        subdomain: "www"
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
        domain: "clubs",
        subdomain: "lions"
    }
];

/* eslint-disable max-nested-callbacks */
describe("react-wildcat-handoff/getDomainRoutesTest.js", () => {
    describe("getDomainRoutes", () => {
        it("returns the right tld, domain and subdomain", done => {
            testResolveOptions.forEach(resolveOption => {
                newGetDomainRoutes(
                    newDomains,
                    resolveOption.headers,
                    (foo, subDomainResult) => {
                        console.log(
                            "---- getDomainRoutes callback:",
                            foo,
                            subDomainResult
                        );
                    }
                );
            });

            done();
        });
    });

    describe("getDomainDataFromHost", () => {
        it("returns the right tld, domain and subdomain", done => {
            testHosts.forEach(test => {
                const result = getDomainDataFromHost(test.host, domains);
                console.log("result: ", result, "test:", test);
                expect(result.tld).to.equal(test.tld);
                expect(result.domain).to.equal(test.domain);
                expect(result.subdomain).to.equal(test.subdomain);
            });
            done();
        });
    });

    describe("completeGetDomainRoutes", () => {
        it("does stuff", done => {
            testResolveOptions.forEach(resolveOptions => {
                completeGetDomainRoutes(
                    resolveOptions,
                    (foo, subDomainResult) => {
                        console.log("---- callback:", foo, subDomainResult);
                    }
                );
            });
            done();
        });
    });
});
