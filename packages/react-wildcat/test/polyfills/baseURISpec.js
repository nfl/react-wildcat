const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

module.exports = () => {
    "use strict";

    describe("baseURI", () => {
        it("adds baseURI polyfill", () => {
            const baseURI = require("../../src/polyfills/baseURI.js");

            expect(baseURI)
                .to.exist;

            expect(global.baseURI)
                .to.be.a("string")
                .that.equals(baseURI);
        });
    });
};
