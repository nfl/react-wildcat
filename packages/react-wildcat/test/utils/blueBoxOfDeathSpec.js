const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

module.exports = stubs => {
    describe("blueBoxOfDeath", () => {
        it("returns an HTML template", () => {
            const blueBoxOfDeath = require("../../src/utils/blueBoxOfDeath");
            const template = blueBoxOfDeath(
                stubs.errorStub,
                stubs.failedRequest
            );

            expect(template).to.exist;

            expect(template).to.be.a("string");
        });

        [
            {
                name: "title",
                content: `<title>‼️💩️️ Runtime Error️</title>`
            },
            {
                name: "error message",
                content: `Error: ${stubs.errorStub.message}`
            },
            {
                name: "error stack",
                content: stubs.errorStub.stack
            },
            {
                name: "request",
                content: JSON.stringify(stubs.failedRequest, null, 4)
            }
        ].forEach(test => {
            it(`renders the ${test.name}`, () => {
                const blueBoxOfDeath = require("../../src/utils/blueBoxOfDeath");
                const template = blueBoxOfDeath(
                    stubs.errorStub,
                    stubs.failedRequest
                );

                expect(template).to.contain(test.content);
            });
        });

        it("handles a Webpack error", () => {
            const blueBoxOfDeath = require("../../src/utils/blueBoxOfDeath");
            const template = blueBoxOfDeath(
                stubs.errorArrayStub,
                stubs.failedRequest
            );

            stubs.errorArrayStub.forEach(errorStub => {
                expect(template).to.contain(errorStub.message);
            });
        });

        it("returns an HTML template with no specified error", () => {
            const blueBoxOfDeath = require("../../src/utils/blueBoxOfDeath");
            const template = blueBoxOfDeath(undefined, stubs.failedRequest);

            expect(template).to.exist;

            expect(template).to.be.a("string");

            expect(template).to.not.contain(`Error Message:`);

            expect(template).to.not.contain(`Stack Trace:`);
        });
    });
};
