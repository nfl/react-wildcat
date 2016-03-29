const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

module.exports = (stubs) => {
    "use strict";

    describe("logTransformError", () => {
        it("returns an error message log", () => {
            const logTransformError = require("../../src/utils/logTransformError");
            const errorLog = logTransformError(stubs.errorStub);

            expect(errorLog)
                .to.be.a("string")
                .that.contains(stubs.errorStub);
        });
    });
};
