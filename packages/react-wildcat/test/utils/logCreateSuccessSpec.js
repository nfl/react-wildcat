const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

module.exports = (stubs) => {
    "use strict";

    describe("logCreateSuccess", () => {
        it("returns a success message log", () => {
            const logCreateSuccess = require("../../src/utils/logCreateSuccess");
            const successLog = logCreateSuccess(stubs.mainEntrySourcePath);

            expect(successLog)
                .to.be.a("string")
                .that.contains(stubs.mainEntrySourcePath);
        });
    });
};
