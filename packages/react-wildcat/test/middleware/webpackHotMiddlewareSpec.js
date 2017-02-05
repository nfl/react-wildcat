// const fs = require("fs-extra");
// const co = require("co");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

// const path = require("path");
// const pathExists = require("path-exists");

module.exports = (stubs) => {
    describe("webpackHotMiddleware", () => {
        before(() => {
            sinon.stub(stubs.logger, "meta").returns();
        });

        after(() => {
            stubs.logger.meta.restore();
        });

        it("provides a middleware function", () => {
            const webpackHotMiddleware = require("../../src/middleware/webpackHotMiddleware");

            expect(webpackHotMiddleware)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("webpackHotMiddleware");
        });
    });
};
