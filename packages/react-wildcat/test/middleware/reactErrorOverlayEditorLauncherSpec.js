const co = require("co");

const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

module.exports = () => {
    describe("reactErrorOverlayEditorLauncher", () => {
        it("provides a middleware function", () => {
            const reactErrorOverlayEditorLauncher = require("../../src/middleware/reactErrorOverlayEditorLauncher");
            expect(reactErrorOverlayEditorLauncher).to.be
                .a("function")
                .that.has.property("name")
                .that.equals("reactErrorOverlayEditorLauncher");
        });

        it("adds react error overlay middleware", done => {
            const reactErrorOverlayEditorLauncher = require("../../src/middleware/reactErrorOverlayEditorLauncher");

            const launcherMiddlewareFn = reactErrorOverlayEditorLauncher();

            co(function*() {
                return yield launcherMiddlewareFn.call(
                    {
                        response: {
                            status: 500
                        },
                        state: {
                            reactErrorOverlay: {
                                file: "foo.js",
                                lineNumber: 100
                            }
                        }
                    },
                    next => next()
                );
            })
                .then(result => {
                    expect(result).to.not.exist;
                    done();
                })
                .catch(done);
        });
    });
};
