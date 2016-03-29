"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const fs = require("fs-extra");

const proxyquire = require("proxyquire");
const pathExists = require("path-exists");

module.exports = (stubs, loggerStub) => {
    "use strict";

    describe("prepTranspiledModule", () => {
        const ignoredFiles = [
            "**/{shell,e2e,test}/**"
        ];

        const testOptions = {
            args: [
                stubs.sourceDir
            ],

            ignore: ignoredFiles
        };

        it("prepares transpile data to be transpiled", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const prepTranspiledModule = require("../../utils/prepTranspiledModule")(commanderStub, stubs.wildcatOptions);

            prepTranspiledModule(stubs.mainEntrySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.mainEntrySourcePath)))
                    .to.be.true;

                done();
            });
        });

        it("gracefully handles a missing .babelrc", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const prepTranspiledModule = proxyquire("../../utils/prepTranspiledModule", {
                "path-exists": {
                    sync: () => false
                }
            })(commanderStub, stubs.wildcatOptions);

            prepTranspiledModule(stubs.mainEntrySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.mainEntrySourcePath)))
                    .to.be.true;

                done();
            });
        });

        [{
            name: "transpiles a source file",
            entry: stubs.mainEntrySourcePath,
            outputPath: stubs.mainEntryTranspiledPath,
            outputContents: [
                `var _routesConfigJs = require("./routes.config.js");`
            ],
            commanderOptions: testOptions,
            wildcatOptions: stubs.wildcatOptions
        }, {
            name: "transpiles a source file with code coverage instrumentation",
            entry: stubs.mainEntrySourcePath,
            outputPath: stubs.mainEntryTranspiledPath,
            outputContents: [
                `__cov_`,
                `__coverage__`
            ],
            commanderOptions: testOptions,
            wildcatOptions: Object.assign({}, stubs.wildcatOptions, {
                coverage: "e2e"
            })
        }].forEach((test) => {
            it(test.name, (done) => {
                const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, test.commanderOptions));
                const prepTranspiledModule = require("../../utils/prepTranspiledModule")(commanderStub, test.wildcatOptions);

                prepTranspiledModule(test.entry, (err) => {
                    expect(err)
                        .to.not.exist;

                    expect(pathExists.sync(test.outputPath))
                        .to.be.true;

                    const fileContents = fs.readFileSync(test.outputPath, "utf8");

                    test.outputContents.forEach(contents => {
                        expect(fileContents)
                            .to.be.a("string")
                            .that.includes(contents);
                    });

                    done();
                });
            });
        });

        it("reports a transpile error", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const prepTranspiledModule = proxyquire("../../utils/prepTranspiledModule", {
                "node-notifier": {
                    notify: () => {}
                }
            })(commanderStub, stubs.wildcatOptions);

            const testData = `
                const x = "y";\nx = "z";
            `.trim();

            fs.outputFileSync(stubs.failureTestFile, testData, "utf8");

            prepTranspiledModule(stubs.failureTestFile, (err) => {
                expect(err)
                    .to.exist;

                expect(err)
                    .to.be.an.instanceof(SyntaxError);

                expect(err.message)
                    .to.equal(`${stubs.failureTestFile}: Line 2: "x" is read-only`);

                expect(loggerStub.error.lastCall.args[0])
                    .to.include(
                        `SyntaxError: ${stubs.failureTestFile}: Line 2: "x" is read-only`
                    );

                fs.removeSync(stubs.failureTestFile);
                done();
            });
        });
    });
};
