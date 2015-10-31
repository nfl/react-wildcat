import React from "react";
import testTree from "react-test-tree";

import HelmetExample from "../HelmetExample.js";
import * as helmetExampleRoutes from "../routes.js";

describe("Helmet Example", () => {
    let helmetExampleTree;
    const helmetExamplePath = "/helmet-example";

    it("should be available", () => {
        expect(HelmetExample).to.exist;
    });

    context("render", () => {
        before(() => {
            helmetExampleTree = testTree(
                <HelmetExample />
            );
        });

        it("should render correctly", () => {
            expect(helmetExampleTree).to.exist;
            expect(helmetExampleTree.isMounted()).to.be.true;
            expect(helmetExampleTree).to.respondTo("get");
        });

        after(() => {
            helmetExampleTree.dispose();
        });
    });

    context("routes", () => {
        it("should have a defined path", () => {
            expect(helmetExampleRoutes).to.exist;
            expect(helmetExampleRoutes)
                .to.have.property("path")
                .that.is.a("string")
                .that.equals(helmetExamplePath);
        });

        it("should asynchronously fetch component", (done) => {
            expect(helmetExampleRoutes).to.exist;
            expect(helmetExampleRoutes).to.respondTo("getComponent");

            helmetExampleRoutes.getComponent(location, (err, module) => {
                expect(err).to.be.null;

                expect(module).to.exist;
                expect(module).to.be.a("function");
                expect(module).to.equal(HelmetExample);

                done();
            });
        });
    });
});

