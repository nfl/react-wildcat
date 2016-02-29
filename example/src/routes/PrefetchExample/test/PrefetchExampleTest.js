import "isomorphic-fetch";

import React from "react";
import testTree from "react-test-tree";

import PrefetchExample from "../PrefetchExample.js";
import * as prefetchExampleRoutes from "../routes.js";

describe("Prefetch Example", () => {
    let prefetchExampleTree;

    const prefetchExamplePath = "/prefetch-example";

    it("should be available", () => {
        expect(PrefetchExample).to.exist;
    });

    context("prefetch", () => {
        it("should prefetch data", async (done) => {
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

            prefetchExampleTree = testTree(
                <PrefetchExample />
            );
        });

        it("should render correctly", () => {
            expect(prefetchExampleTree).to.exist;
            expect(prefetchExampleTree.isMounted()).to.be.true;
            expect(prefetchExampleTree).to.respondTo("get");
        });

        after(() => {
            prefetchExampleTree.dispose();
        });
    });

    context("routes", () => {
        it("should have a defined path", () => {
            expect(prefetchExampleRoutes).to.exist;
            expect(prefetchExampleRoutes)
                .to.have.property("path")
                .that.is.a("string")
                .that.equals(prefetchExamplePath);
        });

        it("should asynchronously fetch component", (done) => {
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

