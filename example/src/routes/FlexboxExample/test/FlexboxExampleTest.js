import React from "react";
import testTree from "react-test-tree";

import FlexboxExample from "../FlexboxExample.js";
import * as flexboxExampleRoutes from "../routes.js";

describe("Flexbox Example", () => {
    let flexboxExampleTree;
    const flexboxExamplePath = "/flexbox-example";

    it("should be available", () => {
        expect(FlexboxExample).to.exist;
    });

    context("render", () => {
        before(() => {
            flexboxExampleTree = testTree(
                <FlexboxExample />
            );
        });

        it("should render correctly", () => {
            expect(flexboxExampleTree).to.exist;
            expect(flexboxExampleTree.isMounted()).to.be.true;
            expect(flexboxExampleTree).to.respondTo("get");
        });

        after(() => {
            flexboxExampleTree.dispose();
        });
    });

    context("routes", () => {
        it("should have a defined path", () => {
            expect(flexboxExampleRoutes).to.exist;
            expect(flexboxExampleRoutes)
                .to.have.property("path")
                .that.is.a("string")
                .that.equals(flexboxExamplePath);
        });

        it("should asynchronously fetch component", (done) => {
            expect(flexboxExampleRoutes).to.exist;
            expect(flexboxExampleRoutes).to.respondTo("getComponent");

            flexboxExampleRoutes.getComponent(location, (err, module) => {
                expect(err).to.be.null;

                expect(module).to.exist;
                expect(module).to.be.a("function");
                expect(module).to.equal(FlexboxExample);

                done();
            });
        });
    });
});

