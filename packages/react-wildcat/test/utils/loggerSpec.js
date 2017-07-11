const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const chalk = require("chalk");

module.exports = stubs => {
    describe("logger", () => {
        it("bootstraps custom logger", () => {
            const CustomLogger = require("../../src/utils/logger.js");

            expect(CustomLogger).to.exist;

            const customLoggerInstance = new CustomLogger(stubs.customEmoji);

            expect(customLoggerInstance).to.be.an.instanceof(CustomLogger);
        });

        Object.keys(stubs.logMethods).forEach(method => {
            it(`responds to logger.${method}`, () => {
                const testLog = `test log`;

                const consoleStub = sinon
                    .stub(console, stubs.logMethods[method])
                    .returns();

                const CustomLogger = require("../../src/utils/logger.js");
                const customLogger = new CustomLogger(stubs.customEmoji);

                customLogger[method](testLog);

                expect(consoleStub).to.have.been.calledWith(
                    stubs.addColor(`${customLogger.id}  ~>`, method),
                    stubs.addColor(testLog, method)
                );

                console[stubs.logMethods[method]].restore();
            });
        });

        it("logger.error outputs an Error stack trace", () => {
            const CustomLogger = require("../../src/utils/logger.js");

            const getErrorColor = str => {
                return chalk.styles.red.open + str + chalk.styles.red.close;
            };

            const errorStub = new Error("test error");
            const errorIdStub = arg => {
                return getErrorColor(
                    `${stubs.customEmoji}  ~>${arg ? ` ${arg}` : ``}`
                );
            };

            expect(CustomLogger).to.exist;

            const customLoggerInstance = new CustomLogger(stubs.customEmoji);
            const consoleErrorStub = sinon.stub(console, "error").returns();

            customLoggerInstance.error(errorStub);

            expect(consoleErrorStub.args[2][0]).to.equal(
                getErrorColor(errorStub.stack)
            );

            expect(consoleErrorStub).to.have.been.calledWith(
                errorIdStub(),
                errorStub
            );

            expect(consoleErrorStub).to.have.been.calledWith(
                errorIdStub("Stack Trace:")
            );

            console.error.restore();
        });

        describe("Graylog", () => {
            ["development", "production"].forEach(env => {
                describe(env, () => {
                    beforeEach(() => {
                        jest.resetModules();
                    });

                    afterEach(() => {
                        jest.unmock("gelf-pro");
                        jest.unmock("../../src/utils/getWildcatConfig");
                    });

                    Object.keys(stubs.logMethods).forEach(method => {
                        it(`sends logger.${method} data to Graylog as an "${stubs.mapLogMethods[method]}" log`, () => {
                            const testLog = `test log`;
                            const mockSetConfigStub = sinon.stub();
                            const mockGraylogSettingsStub = {
                                fields: {
                                    app: "example",
                                    env,
                                    loggerName: "example"
                                }
                            };

                            jest.mock("gelf-pro", () => {
                                const gelfPro = jest.genMockFromModule(
                                    "gelf-pro"
                                );
                                gelfPro.setConfig = mockSetConfigStub;
                                return gelfPro;
                            });

                            jest.mock(
                                "../../src/utils/getWildcatConfig",
                                () => {
                                    const wildcatConfig = require("../../src/config/wildcat.config.js");
                                    return function() {
                                        wildcatConfig.serverSettings.graylog = mockGraylogSettingsStub;
                                        return wildcatConfig;
                                    };
                                }
                            );

                            const CustomLogger = require("../../src/utils/logger.js");

                            expect(CustomLogger).to.exist;

                            const customLogger = new CustomLogger(
                                stubs.customEmoji
                            );

                            expect(customLogger).to.be.an.instanceof(
                                CustomLogger
                            );

                            const consoleStub = sinon
                                .stub(console, stubs.logMethods[method])
                                .returns();

                            expect(customLogger).to.respondTo(method);

                            customLogger[method](testLog);

                            expect(mockSetConfigStub).to.have.been.calledWith(
                                mockGraylogSettingsStub
                            );

                            expect(
                                consoleStub.lastCall
                            ).to.have.been.calledWith(
                                stubs.addColor(
                                    `${customLogger.id}  ~>`,
                                    method
                                ),
                                stubs.addColor(testLog, method)
                            );

                            console[stubs.logMethods[method]].restore();
                        });
                    });
                });
            });
        });
    });
};
