const React = require("react");
const chai = require("chai");
const expect = chai.expect;
const matchMediaMock = require("match-media-mock").create();

const configuredRadium = require("../");

describe("react-wildcat-radium", () => {
    it("exists", () => {
        expect(configuredRadium).to.exist;
    });

    context("exposes all vanilla Radium methods", () => {
        [
            "Plugins",
            "PrintStyleSheet",
            "Style",
            "getState",
            "keyframes"
        ].forEach(methodName => {
            it(methodName, () => {
                expect(configuredRadium)
                    .itself.to.have.property(methodName);
            });
        });
    });

    it("sets matchMedia", () => {
        expect(configuredRadium)
            .itself.to.have.property("setMatchMedia");

        expect(configuredRadium.setMatchMedia(matchMediaMock))
            .to.be.undefined;
    });

    it("wraps a React component", () => {
        const StubComponent = React.createClass({
            statics: {
                test: true
            },

            render: function render() {
                return React.createElement("div");
            }
        });

        const WrappedStubComponent = configuredRadium(StubComponent);

        expect(WrappedStubComponent)
            .to.be.a("function");

        expect(WrappedStubComponent)
            .to.have.property("name")
            .that.equals("RadiumEnhancer");

        expect(WrappedStubComponent)
            .to.have.property("test")
            .that.is.true;
    });
});
