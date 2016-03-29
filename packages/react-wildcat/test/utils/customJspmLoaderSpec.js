const fs = require("fs-extra");
const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const pathExists = require("path-exists");
const proxyquire = require("proxyquire").noPreserveCache();

module.exports = (stubs) => {
    "use strict";

    describe("createImportableModule", () => {
        beforeEach(() => {
            [
                stubs.binDir,
                stubs.publicDir
            ].forEach(fs.removeSync);
        });

        [{
            name: "creates an customized jspm loader",
            wildcatConfig: stubs.wildcatConfig
        }, {
            name: "re-uses a cached custom jspm loader on subsequent requests",
            wildcatConfig: stubs.wildcatConfig
        }].forEach(test => {
            it(test.name, () => {
                const customJspmLoader = proxyquire("../../src/utils/customJspmLoader", {});

                const customizedLoader = customJspmLoader(stubs.exampleDir, {
                    wildcatConfig: test.wildcatConfig
                });

                expect(customizedLoader)
                    .to.exist;

                expect(customizedLoader)
                    .to.be.an("object");
            });
        });

        it("sets baseURL to a remote origin if localPackageCache is falsy", () => {
            const customJspmLoader = proxyquire("../../src/utils/customJspmLoader", {});

            const customizedLoader = customJspmLoader(stubs.exampleDir, {
                wildcatConfig: Object.assign({}, stubs.wildcatConfig, {
                    serverSettings: {
                        localPackageCache: false
                    }
                })
            });

            expect(customizedLoader)
                .to.exist;

            expect(customizedLoader)
                .to.be.an("object");

            expect(customizedLoader.baseURL)
                .to.be.a("string")
                .that.equals(stubs.wildcatConfig.generalSettings.staticUrl);
        });

        it("gracefully handles missing jspm config in the project's package.json", () => {
            fs.outputFileSync(stubs.temporaryPackageJSON, JSON.stringify({}), "utf8");

            expect(pathExists.sync(stubs.temporaryPackageJSON))
                .to.be.true;

            const customJspmLoader = proxyquire("../../src/utils/customJspmLoader", {
                "path": {
                    join: () => stubs.temporaryPackageJSON
                }
            });

            const customizedLoader = customJspmLoader(stubs.exampleDir, {
                wildcatConfig: Object.assign({}, stubs.wildcatConfig, {
                    serverSettings: {
                        localPackageCache: false
                    }
                })
            });

            fs.removeSync(stubs.temporaryPackageJSON);

            expect(customizedLoader)
                .to.exist;

            expect(customizedLoader)
                .to.be.an("object");

            expect(customizedLoader.baseURL)
                .to.be.a("string")
                .that.equals(stubs.wildcatConfig.generalSettings.staticUrl);
        });

        [{
            name: "resolves local module paths with localPackageCache enabled",
            wildcatConfig: Object.assign({}, stubs.wildcatConfig, {
                serverSettings: {
                    localPackageCache: true
                }
            }),
            entry: stubs.mainEntryTranspiledPath,
            expectation: `${stubs.origin}/${stubs.mainEntryTranspiledPath}`
        }, {
            name: "resolves local module paths with localPackageCache disabled",
            wildcatConfig: Object.assign({}, stubs.wildcatConfig, {
                serverSettings: {
                    localPackageCache: false
                }
            }),
            entry: stubs.mainEntryTranspiledPath,
            expectation: `${stubs.origin}/${stubs.mainEntryTranspiledPath}`
        }, {
            name: "resolves binary paths with localPackageCache enabled",
            wildcatConfig: Object.assign({}, stubs.wildcatConfig, {
                serverSettings: {
                    localPackageCache: true
                }
            }),
            entry: stubs.exampleBinaryPath.slice(1),
            expectation: `${stubs.origin}${stubs.exampleBinaryPath}`
        }, {
            name: "resolves binary paths with localPackageCache disabled",
            wildcatConfig: Object.assign({}, stubs.wildcatConfig, {
                serverSettings: {
                    localPackageCache: false
                }
            }),
            entry: stubs.exampleBinaryPath.slice(1),
            expectation: `${stubs.origin}${stubs.exampleBinaryPath}`
        }].forEach(test => {
            it(test.name, (done) => {
                const customJspmLoader = proxyquire("../../src/utils/customJspmLoader", {});

                // console.log(test.wildcatConfig);
                const customizedLoader = customJspmLoader(stubs.exampleDir, {
                    wildcatConfig: test.wildcatConfig
                });

                expect(customizedLoader)
                    .to.exist;

                expect(customizedLoader)
                    .to.be.an("object");

                expect(customizedLoader)
                    .to.respondTo("normalize");

                customizedLoader.normalize(test.entry)
                    .then(url => {
                        expect(url)
                            .to.exist;

                        expect(url)
                            .to.be.a("string")
                            .that.equals(test.expectation);

                        done();
                    })
                    .catch(done);
            });
        });
    });
};
