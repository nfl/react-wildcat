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

    describe("transpiler", () => {
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
            const transpiler = require("../../utils/transpiler")(commanderStub, stubs.wildcatOptions);

            transpiler(stubs.mainEntrySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.mainEntrySourcePath)))
                    .to.be.true;

                done();
            });
        });

        it("gracefully handles a missing .babelrc", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));
            const transpiler = proxyquire("../../utils/transpiler", {
                "path-exists": {
                    sync: () => false
                }
            })(commanderStub, stubs.wildcatOptions);

            transpiler(stubs.mainEntrySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                expect(pathExists.sync(stubs.getPublicPath(stubs.mainEntrySourcePath)))
                    .to.be.true;

                done();
            });
        });

        [{
            name: "transpiles a file",
            entry: stubs.mainEntrySourcePath,
            output: stubs.mainEntryTranspiledPath,
            outputContents: [
                `var _routesConfigJs = require("./routes.config.js");`
            ],
            commanderOptions: testOptions,
            wildcatOptions: stubs.wildcatOptions
        }, {
            name: "transpiles a file with code coverage instrumentation",
            entry: stubs.mainEntrySourcePath,
            output: stubs.mainEntryTranspiledPath,
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
                const transpiler = require("../../utils/transpiler")(commanderStub, test.wildcatOptions);

                transpiler(test.entry, (err) => {
                    expect(err)
                        .to.not.exist;

                    expect(pathExists.sync(test.output))
                        .to.be.true;

                    const fileContents = fs.readFileSync(test.output, "utf8");

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
            const transpiler = proxyquire("../../utils/transpiler", {
                "node-notifier": {
                    notify: () => {}
                }
            })(commanderStub, stubs.wildcatOptions);

            const testData = `
                const x = "y";\nx = "z";
            `.trim();

            fs.outputFileSync(stubs.failureTestFile, testData, "utf8");

            transpiler(stubs.failureTestFile, (err) => {
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
