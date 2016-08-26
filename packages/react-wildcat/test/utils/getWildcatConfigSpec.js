const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const proxyquire = require("proxyquire").noPreserveCache();

module.exports = (stubs) => {
    "use strict";

    describe("getWildcatConfig", () => {
        it("returns a Wildcat configuration object", () => {
            const getWildcatConfig = require("../../src/utils/getWildcatConfig");
            const wildcatConfig = getWildcatConfig(stubs.exampleDir);

            expect(wildcatConfig)
                .to.exist;

            expect(wildcatConfig)
                .to.be.an("object");
        });

        context("with specified config values", () => {
            let wildcatConfig;

            before(() => {
                const customCwd = path.resolve(__dirname, "../fixtures");
                wildcatConfig = proxyquire("../../src/utils/getWildcatConfig.js", {})(customCwd);
            });

            it(`uses specified originUrl`, () => {
                expect(wildcatConfig.generalSettings.originUrl)
                    .to.equal("http://mytestorigin.com");
            });

            it(`uses specified staticUrl`, () => {
                expect(wildcatConfig.generalSettings.staticUrl)
                    .to.equal("http://myteststatic.com");
            });
        });

        context("without specified config values", () => {
            let wildcatConfig;

            before(() => {
                wildcatConfig = proxyquire("../../src/utils/getWildcatConfig.js", {})();
            });

            it(`uses calculated originUrl`, () => {
                expect(wildcatConfig.generalSettings.originUrl)
                    .to.equal("https://www.example.dev:3000");
            });

            it(`uses calculated staticUrl`, () => {
                expect(wildcatConfig.generalSettings.staticUrl)
                    .to.equal("https://static.example.dev:4000");
            });
        });
    });
};
