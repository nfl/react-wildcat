const co = require("co");
const webpack = require("webpack");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

module.exports = (stubs) => {
    describe("webpackHotMiddleware", () => {
        before(() => {
            sinon.stub(stubs.logger, "meta").returns();
        });

        after(() => {
            stubs.logger.meta.restore();
        });

        const wildcatConfig = require("../../src/utils/getWildcatConfig")(stubs.exampleDir);

        it("provides a middleware function", () => {
            const webpackHotMiddleware = require("../../src/middleware/webpackHotMiddleware");
            expect(webpackHotMiddleware)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("webpackHotMiddleware");
        });

        it("adds webpack hot middleware", (done) => {
            const webpackHotMiddleware = require("../../src/middleware/webpackHotMiddleware");
            const webpackDevSettings = stubs.devConfigFile;
            const {
                devConfig,
                hotMiddleware
            } = require(webpackDevSettings);

            const compiler = webpack(devConfig);
            const hotMiddlewareFn = webpackHotMiddleware(compiler, hotMiddleware);

            co(function* () {
                return yield hotMiddlewareFn.call({
                    req: {
                        header: {
                            host: wildcatConfig.generalSettings.originUrl,
                            "user-agent": "Mozilla/5.0"
                        },
                        fresh: false,
                        url: "/"
                    },
                    res: {
                        get: () => Date.now(),
                        status: null,
                        type: "text/html",
                        lastModified: null
                    }
                }, (next) => next());
            })
                .then((result) => {
                    expect(result).to.not.exist;
                    done();
                })
                .catch(done);
        });
    });
};
