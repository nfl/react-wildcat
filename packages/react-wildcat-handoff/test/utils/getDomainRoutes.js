/* @flow */
const chai = require("chai");
const expect = chai.expect;

const getDomainRoutes = require("../../src/utils/getDomainRoutes.js");

/* eslint-disable max-nested-callbacks */
describe.only("getDomainRoutes", () => {
    it("exists", () => {
        expect(getDomainRoutes).to.exist;

        expect(getDomainRoutes).to.be
            .a("function")
            .that.has.property("name")
            .that.equals("getDomainRoutes");
    });

    describe("domain resolution", () => {
        [
            "nfl.com",
            "wildcat.nfl.com",
            "www.wildcat.nfl.com",
            "www.nfluk.com",
            "bills.clubs.nfl.com",
            "bills.clubs.wildcat.nfl.com",
            "bills.nfl"
        ].forEach((domain /* : string */) => {
            it(`resolves ${domain}`, () => {
                console.log(domain);
            });
        });
    });
});
