const chai = require("chai");
const expect = chai.expect;

const moduleHotStub = require("../src/index.js");

describe("react-transform-module-hot-stub", () => {
    it("exists", () => {
        expect(moduleHotStub).to.exist;
    });

    it("takes a reference object", () => {
        const stubRef = {};
        const result = moduleHotStub(stubRef);

        expect(result).to.exist;
    });

    it("returns a pristine copy", () => {
        const stubRef = {};
        const stubReactClass = () => {};
        const result = moduleHotStub(stubRef);

        expect(result).to.exist;
        expect(result).to.be.a("function");
        expect(result(stubReactClass)).to.equal(stubReactClass);
    });

    it("stubs module.hot.accept", () => {
        const hotStub = () => {};

        const stubModule = {
            hot: {
                accept: hotStub
            }
        };

        const stubRef = {
            locals: [stubModule]
        };

        const result = moduleHotStub(stubRef);

        expect(result).to.exist;
        expect(stubModule.hot)
            .to.have.property("accept")
            .that.is.a("function")
            .that.equals(hotStub);
    });

    it("stubs module.hot", () => {
        const stubModule = {
            hot: {}
        };

        const stubRef = {
            locals: [stubModule]
        };

        const result = moduleHotStub(stubRef);

        expect(result).to.exist;
        expect(stubModule.hot)
            .to.have.property("accept")
            .that.is.a("function")
            .that.has.property("name")
            .that.equals("hotStub");
        expect(stubModule.hot.accept())
            .to.be.undefined;
    });

    it("stubs module", () => {
        const stubModule = {};

        const stubRef = {
            locals: [stubModule]
        };

        const result = moduleHotStub(stubRef);

        expect(result).to.exist;
        expect(stubModule)
            .to.have.property("hot")
            .that.is.an("object")
            .that.has.property("accept")
            .that.is.a("function");

        expect(stubModule.hot.accept).to.exist;
        expect(stubModule.hot.accept)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("hotStub");
        expect(stubModule.hot.accept())
            .to.be.undefined;
    });
});
