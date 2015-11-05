import React from "react";
import ReactTestUtils from "react-addons-test-utils";
import Prefetch from "../../index.js"; // eslint-disable-line import/default

import Hello from "./fixtures/Hello.js";
import HelloES7 from "./fixtures/HelloES7.js";
import World from "./fixtures/World.js";

describe("react-wildcat-prefetch", () => {
    const noop = () => {
        return Promise.resolve([]);
    };

    describe("prefetch mock component", () => {
        it("should have two props", () => {
            const Component = ReactTestUtils.renderIntoDocument(<Hello title={"Test Title"}/>);
            expect(Object.keys(Component.props).length).to.equal(2);
        });

        it("should have a static method", () => {
            expect(Hello.staticMethod).to.be.a("function");
            expect(Hello.staticMethod()).to.equal(42);
        });
    });

    describe("prefetch HoC", () => {
        let WrappedPrefetch;

        describe("using ES6 Classes", () => {
            beforeEach(() => {
                WrappedPrefetch = Prefetch(noop)(Hello);
            });

            it("should add static methods to the component", () => {
                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("run");
                expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                expect(WrappedPrefetch.prefetch.getKey()).to.equal("asyncData");

                WrappedPrefetch = Prefetch(noop, "newkey")(Hello);
                expect(WrappedPrefetch.prefetch.getKey()).to.equal("newkey");
            });

            it("should inherit static members", () => {
                expect(WrappedPrefetch)
                    .itself.to.respondTo("staticMethod");

                expect(WrappedPrefetch.staticMethod)
                    .to.be.a("function");

                expect(WrappedPrefetch.staticMethod())
                    .to.equal(42);
            });
        });

        describe("using ES7 static class members", () => {
            beforeEach(() => {
                WrappedPrefetch = Prefetch(noop)(HelloES7);
            });

            it("should add static methods to the component", () => {
                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("run");
                expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                expect(WrappedPrefetch.prefetch.getKey()).to.equal("asyncData");

                WrappedPrefetch = Prefetch(noop, "newkey")(Hello);
                expect(WrappedPrefetch.prefetch.getKey()).to.equal("newkey");
            });

            it("should inherit static members", () => {
                expect(WrappedPrefetch)
                    .itself.to.respondTo("staticMethod");

                expect(WrappedPrefetch.staticMethod)
                    .to.be.a("function");

                expect(WrappedPrefetch.staticMethod())
                    .to.equal(42);
            });
        });

        describe("using React.createClass", () => {
            beforeEach(() => {
                WrappedPrefetch = Prefetch(noop)(World);
            });

            it("should add static methods to the component", () => {
                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("run");
                expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                expect(WrappedPrefetch.prefetch.getKey()).to.equal("asyncData");

                WrappedPrefetch = Prefetch(noop, "newkey")(World);
                expect(WrappedPrefetch.prefetch.getKey()).to.equal("newkey");
            });

            it("should inherit static members", () => {
                expect(WrappedPrefetch)
                    .itself.to.respondTo("staticMethod");

                expect(WrappedPrefetch.staticMethod)
                    .to.be.a("function");

                expect(WrappedPrefetch.staticMethod())
                    .to.equal(42);
            });
        });
    });
});
