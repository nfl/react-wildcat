const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const proxyquire = require("proxyquire");

module.exports = stubs => {
    describe("getMorganOptions", () => {
        const testLog = ``;
        const morganRequestStub = {
            headers: {
                host: "www.example.com"
            },
            method: "GET",
            url: "/public"
        };

        it("returns morgan options", () => {
            const getMorganOptions = require("../../src/utils/getMorganOptions");
            const morganOptions = getMorganOptions(
                stubs.logLevel,
                stubs.serverSettings
            );

            expect(morganOptions).to.exist;

            expect(morganOptions).to.be.an("object");

            expect(morganOptions)
                .to.have.property("skip")
                .that.is.a("function");

            expect(morganOptions)
                .to.have.property("stream")
                .that.is.an("object")
                .that.has.property("write")
                .that.is.a("function");
        });

        const statusCodes = {
            200: true,
            201: true,
            202: true,
            301: true,
            302: true,
            304: true,
            400: false,
            404: false,
            500: false
        };

        [
            {
                logLevel: 0,
                statusCodes
            },
            {
                logLevel: 1,
                statusCodes
            },
            {
                logLevel: 2,
                statusCodes
            },
            {
                logLevel: 3,
                statusCodes: Object.assign({}, statusCodes, {
                    200: false,
                    201: false,
                    202: false,
                    301: false,
                    302: false,
                    304: false,
                    400: true,
                    404: true,
                    500: true
                })
            },
            {
                logLevel: 4,
                statusCodes: {
                    200: null,
                    201: null,
                    202: null,
                    301: null,
                    302: null,
                    304: null,
                    400: null,
                    404: null,
                    500: null
                }
            }
        ].forEach(test => {
            context(
                `returns custom morgan options when logLevel is ${
                    test.logLevel
                }`,
                () => {
                    Object.keys(test.statusCodes).forEach(statusCode => {
                        it(`with a ${statusCode} statusCode`, () => {
                            const getMorganOptions = require("../../src/utils/getMorganOptions");
                            const morganOptions = getMorganOptions(
                                test.logLevel,
                                stubs.serverSettings
                            );

                            expect(morganOptions).to.exist;

                            expect(morganOptions).to.be.an("object");

                            expect(morganOptions)
                                .to.have.property("skip")
                                .that.is.a("function");

                            expect(morganOptions)
                                .to.have.property("stream")
                                .that.is.an("object")
                                .that.has.property("write")
                                .that.is.a("function");

                            morganOptions.stream.write(testLog);

                            const shouldSkip = morganOptions.skip(
                                morganRequestStub,
                                {
                                    statusCode
                                }
                            );

                            expect(shouldSkip).to.equal(
                                test.statusCodes[statusCode]
                            );
                        });
                    });
                }
            );
        });

        context("Graylog", () => {
            ["development", "production"].forEach(env => {
                context(env, () => {
                    it(`sends data to Graylog`, () => {
                        const setConfigStub = sinon.stub();
                        const graylogSettingsStub = {
                            fields: {
                                app: "example",
                                env,
                                loggerName: "example"
                            }
                        };

                        const getMorganOptions = proxyquire(
                            "../../src/utils/getMorganOptions.js",
                            {
                                "gelf-pro": {
                                    setConfig: setConfigStub
                                }
                            }
                        );

                        expect(getMorganOptions).to.exist;

                        const morganOptions = getMorganOptions(
                            stubs.logLevel,
                            Object.assign({}, stubs.serverSettings, {
                                graylog: graylogSettingsStub
                            })
                        );

                        morganOptions.stream.write(testLog);

                        expect(setConfigStub).to.have.been.calledWith(
                            graylogSettingsStub
                        );

                        const shouldSkip = morganOptions.skip(
                            morganRequestStub,
                            {
                                statusCode: stubs.statusCode
                            }
                        );

                        expect(shouldSkip).to.equal(null);
                    });
                });
            });
        });
    });
};
