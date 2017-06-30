import "isomorphic-fetch";

import React from "react";
import {mount} from "enzyme";
import {expect} from "chai";

import PrefetchExample from "../PrefetchExample.js";
import * as prefetchExampleRoutes from "../routes.js";

describe("Prefetch Example", () => {
    const prefetchExamplePath = "/prefetch-example";

    it("is available", () => {
        expect(PrefetchExample).to.exist;
    });

    describe("prefetch", () => {
        it("prefetches data", async () => {
            expect(PrefetchExample).itself.to.have.property("prefetch");

            const {prefetch} = PrefetchExample;

            expect(prefetch).to.respondTo("getKey");

            expect(prefetch.getKey()).to.equal("asyncData");

            expect(prefetch).to.respondTo("run");

            const asyncData = await prefetch.run();

            PrefetchExample.prefetch = {
                ...PrefetchExample.prefetch,
                asyncData
            };

            expect(asyncData).to.exist;
        });
    });

    describe("render", () => {
        beforeAll(() => {
            expect(PrefetchExample).itself.to.have.property("WrappedComponent");

            expect(PrefetchExample.WrappedComponent).to.exist;
        });

        it("renders correctly", () => {
            const prefetchExample = mount(<PrefetchExample />);

            expect(prefetchExample).to.exist;
        });

        it("renders #prefetch element", () => {
            const prefetchExample = mount(<PrefetchExample />);

            expect(prefetchExample.find(`#prefetch`)).to.have.length.of(1);
        });
    });

    describe("routes", () => {
        it("has a defined path", () => {
            expect(prefetchExampleRoutes).to.exist;
            expect(prefetchExampleRoutes).to.have
                .property("path")
                .that.is.a("string")
                .that.equals(prefetchExamplePath);
        });

        it("asynchronously fetches component", done => {
            expect(prefetchExampleRoutes).to.exist;
            expect(prefetchExampleRoutes).to.respondTo("getComponent");

            prefetchExampleRoutes.getComponent(location, (err, module) => {
                expect(err).to.be.null;

                expect(module).to.exist;
                expect(module).to.be.a("function");
                expect(module).to.equal(PrefetchExample);

                done();
            });
        });
    });
});
