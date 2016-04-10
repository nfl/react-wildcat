import "isomorphic-fetch";

import React from "react";
import {mount} from "enzyme";

import PrefetchExample from "../PrefetchExample.js";
import * as prefetchExampleRoutes from "../routes.js";

describe("Prefetch Example", () => {
    const prefetchExamplePath = "/prefetch-example";

    it("is available", () => {
        expect(PrefetchExample).to.exist;
    });

    context("prefetch", () => {
        it("prefetches data", async (done) => {
            try {
                expect(PrefetchExample)
                    .itself.to.have.property("prefetch");

                const {prefetch} = PrefetchExample;

                expect(prefetch)
                    .to.respondTo("getKey");

                expect(prefetch.getKey())
                    .to.equal("asyncData");

                expect(prefetch)
                    .to.respondTo("run");

                const asyncData = await prefetch.run();
                expect(asyncData).to.exist;

                PrefetchExample.prefetch = {
                    ...PrefetchExample.prefetch,
                    asyncData
                };

                done();
            } catch (e) {
                done(e);
            }
        });
    });

    context("render", () => {
        before(() => {
            expect(PrefetchExample)
                .itself.to.have.property("WrappedComponent");

            expect(PrefetchExample.WrappedComponent).to.exist;
        });

        it("renders correctly", () => {
            const prefetchExample = mount(
                <PrefetchExample />
            );

            expect(prefetchExample).to.exist;
        });

        it("renders #prefetch element", () => {
            const prefetchExample = mount(
                <PrefetchExample />
            );

            expect(prefetchExample.find(`#prefetch`))
                .to.have.length.of(1);
        });
    });

    context("routes", () => {
        it("has a defined path", () => {
            expect(prefetchExampleRoutes).to.exist;
            expect(prefetchExampleRoutes)
                .to.have.property("path")
                .that.is.a("string")
                .that.equals(prefetchExamplePath);
        });

        it("asynchronously fetches component", (done) => {
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

