"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const fs = require("fs-extra");
const path = require("path");

const proxyquire = require("proxyquire");
const pathExists = require("path-exists");

module.exports = (stubs) => {
    "use strict";

    describe("copyFiles", () => {
        const ignoredFiles = [
            "**/{shell,e2e,test}/**"
        ];

        const testOptions = {
            args: [
                stubs.sourceDir
            ],

            ignore: ignoredFiles
        };

        [{
            name: "creates an importable module from a binary file",
            commanderOptions: testOptions
        }, {
            name: "creates an importable module with no defined outDir",
            commanderOptions: Object.assign({}, testOptions, {
                outDir: undefined
            })
        }, {
            name: "creates an importable module with no defined args",
            commanderOptions: Object.assign({}, testOptions, {
                args: []
            })
        }, {
            name: "creates an importable module with a file as an entry point",
            commanderOptions: Object.assign({}, testOptions, {
                args: [
                    stubs.exampleBinarySourcePath
                ]
            })
        }].forEach((test) => {
            it(test.name, (done) => {
                const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults, test.commanderOptions));
                const copyFiles = require("../../utils/copyFiles")(commanderStub, stubs.wildcatOptions);

                copyFiles(stubs.exampleBinarySourcePath)
                    .then(() => {
                        expect(commanderStub)
                            .to.exist;

                        expect(pathExists.sync(path.join(stubs.exampleDir, stubs.exampleBinaryPath)))
                            .to.be.true;

                        const origin = stubs.generalSettings.staticUrl;
                        const binaryFileContents = fs.readFileSync(path.join(stubs.exampleDir, stubs.exampleBinaryPath), "utf8");

                        expect(binaryFileContents)
                            .to.be.a("string")
                            .that.equals(`module.exports = "${origin}${stubs.getBinPath(stubs.exampleBinaryPath)}";`);

                        done();
                    })
                    .catch(done);
            });
        });

        it("does not return an error on a successful file creation", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));

            const copyFiles = proxyquire("../../utils/copyFiles", {
                "../../src/utils/createImportableModule": (optiions, importableResolve) => importableResolve()
            })(commanderStub, stubs.wildcatOptions);

            copyFiles(stubs.exampleBinarySourcePath, (err) => {
                expect(err)
                    .to.not.exist;

                done();
            });
        });

        it("returns an error on a failed file creation", (done) => {
            const commanderStub = new stubs.CommanderStub(Object.assign({}, stubs.commanderDefaults));

            const copyFiles = proxyquire("../../utils/copyFiles", {
                "../../src/utils/createImportableModule": (optiions, importableResolve, importableReject) => importableReject(stubs.errorStub)
            })(commanderStub, stubs.wildcatOptions);

            copyFiles(stubs.exampleBinarySourcePath, (err) => {
                expect(err)
                    .to.exist;

                expect(err)
                    .to.be.an.instanceof(Error);

                expect(err)
                    .to.eql(stubs.errorStub);

                done();
            });
        });
    });
};
