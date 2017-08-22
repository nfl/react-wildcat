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
describe.only("react-wildcat-handoff/getDomainRoutesTest.js", () => {
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
            const resolveOptions = {
                headers: "",
                domainRoutes: "",
                subdomain: ""
            };
            completeGetDomainRoutes();
            done();
        });
    });
});
