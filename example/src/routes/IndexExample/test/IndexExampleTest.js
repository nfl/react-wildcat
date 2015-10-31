import React from "react";
import testTree from "react-test-tree";

import IndexExample from "../IndexExample.js";
import * as indexExampleRoutes from "../routes.js";

describe("Index Example", () => {
    let indexExampleTree;

    it("should be available", () => {
        expect(IndexExample).to.exist;
    });

    context("render", () => {
        before(() => {
            indexExampleTree = testTree(
                <IndexExample />
            );
        });

        it("should render correctly", () => {
            expect(indexExampleTree).to.exist;
            expect(indexExampleTree.isMounted()).to.be.true;
            expect(indexExampleTree).to.respondTo("get");
        });

        after(() => {
            indexExampleTree.dispose();
        });
    });

    context("routes", () => {
        it("should not have a defined path", () => {
            expect(indexExampleRoutes).to.exist;

            // Index routes should not have a path
            expect(indexExampleRoutes)
                .to.not.have.property("path");
        });

        it("should asynchronously fetch component", (done) => {
            expect(indexExampleRoutes).to.exist;
            expect(indexExampleRoutes).to.respondTo("getComponent");

            indexExampleRoutes.getComponent(location, (err, module) => {
                expect(err).to.be.null;

                expect(module).to.exist;
                expect(module).to.be.a("function");
                expect(module).to.equal(IndexExample);

                done();
            });
        });
    });
});

