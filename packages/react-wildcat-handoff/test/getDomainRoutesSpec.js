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
            bills: ["www.buffalobills"]
        }
    }
};

const testHosts = [
    "www.nfl.com",
    "nfl.com",
    "bills.com",
    "www.bills.com",
    "www.wildcat.nfl.com",
    "www.wildcat.bills.com",
    "www.nfl.dev:3000",
    "www.bills.dev:3000"
];

/* eslint-disable max-nested-callbacks */
describe.only("react-wildcat-handoff/getDomainRoutesTest.js", () => {
    describe("getDomainDataFromHost", () => {
        it("does stuff", done => {
            testHosts.forEach(host => {
                console.log(getDomainDataFromHost(host, domains));
            });
            done();
        });
    });

    // describe("completeGetDomainRoutes", () => {});
});
