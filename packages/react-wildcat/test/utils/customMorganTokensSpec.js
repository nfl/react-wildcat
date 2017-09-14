const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const chalk = require("chalk");

module.exports = stubs => {
    describe("customMorganTokens", () => {
        const morgan = require("koa-morgan");

        const customMorganTokens = require("../../src/utils/customMorganTokens.js")(
            morgan,
            stubs.customEmoji
        );

        it("bootstraps morgan logger", () => {
            expect(customMorganTokens).to.exist;
        });

        context("id", () => {
            it("logs custom IDs", () => {
                const id = stubs.customEmoji;

                expect(customMorganTokens).to.have.property("id");

                const result = customMorganTokens.id({
                    id
                });

                expect(result)
                    .to.be.a("string")
                    .that.equals(
                        `${chalk.styles.gray.open}${id}  ~>${chalk.styles.gray
                            .close}`
                    );
            });
        });

        context("status", () => {
            [
                {code: 200, color: "cyan"},
                {code: 301, color: "magenta"},
                {code: 404, color: "red"},
                {code: 500, color: "red"}
            ].forEach(status => {
                it(`logs ${status.code} status codes`, () => {
                    expect(customMorganTokens).to.have.property("status");

                    const result = customMorganTokens.status(
                        {},
                        {
                            statusCode: status.code
                        }
                    );

                    expect(result)
                        .to.be.a("string")
                        .that.equals(
                            chalk.styles[status.color].open +
                                status.code +
                                chalk.styles[status.color].close
                        );
                });
            });
        });

        context("url", () => {
            ["originalUrl", "url"].forEach(parameter => {
                it(`logs requests using req.${parameter}`, () => {
                    const url = "/flexbox-example";

                    expect(customMorganTokens).to.have.property("url");

                    const result = customMorganTokens.url({
                        [parameter]: url
                    });

                    expect(result)
                        .to.be.a("string")
                        .that.equals(
                            chalk.styles.gray.open +
                                url +
                                chalk.styles.gray.close
                        );
                });
            });
        });
    });
};
