const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

module.exports = () => {
    "use strict";

    describe("fetch", () => {
        const fetch = require("../../src/polyfills/fetch.js");

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
};
