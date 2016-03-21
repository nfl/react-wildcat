"use strict";

const chai = require("chai");
const expect = chai.expect;

const cwd = process.cwd();
const path = require("path");
const proxyquire = require("proxyquire");

/* eslint-disable max-nested-callbacks */
describe("utils - getWildcatConfig", () => {
    const exampleDir = path.join(cwd, "example");
    const projectConfigFile = path.join(exampleDir, "wildcat.config.js");

    before(() => {
        process.chdir(exampleDir);
    });


    context("when app config HAS specified config values", () => {
        let wildcatConfig;

        before(() => {
            var originalConfig = require(projectConfigFile);
            originalConfig.generalSettings.originUrl = "http://mytestorigin.com";
            originalConfig.generalSettings.staticUrl = "http://myteststatic.com";

            var mockedRequires = {};
            mockedRequires[`${exampleDir}/wildcat.config.js`] = () => originalConfig;

            const CustomGetWildcatConfig = proxyquire("../src/utils/getWildcatConfig.js", mockedRequires);

            wildcatConfig = CustomGetWildcatConfig();
        });

        after(() => {
            delete wildcatConfig.generalSettings.originUrl;
            delete wildcatConfig.generalSettings.staticUrl;
        });

        it("should use specified 'originUrl'", () => {
            expect(wildcatConfig.generalSettings.originUrl)
                .to.equal("http://mytestorigin.com");
        });

        it("should use specified 'staticUrl'", () => {
            expect(wildcatConfig.generalSettings.staticUrl)
                .to.equal("http://myteststatic.com");
        });
    });

    context("when app config has not specified values", () => {
        let wildcatConfig;

        before(() => {
            var originalConfig = require(projectConfigFile);
            delete originalConfig.generalSettings.originUrl;
            delete originalConfig.generalSettings.staticUrl;

            var mockedRequires = {};
            mockedRequires[`${exampleDir}/wildcat.config.js`] = () => originalConfig;

            const CustomGetWildcatConfig = proxyquire("../src/utils/getWildcatConfig.js", mockedRequires);

            wildcatConfig = CustomGetWildcatConfig();
        });

        it("Should use calculated property 'originUrl'", () => {
            expect(wildcatConfig.generalSettings.originUrl)
                .to.equal("https://localhost:3000");
        });

        it("Should use calculated property 'staticUrl'", () => {
            expect(wildcatConfig.generalSettings.staticUrl)
                .to.equal("https://localhost:4000");
        });
    });
});
