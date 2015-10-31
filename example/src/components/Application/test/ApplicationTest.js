import React from "react";
import testTree from "react-test-tree";

import {ApplicationComponent as Application} from "../Application.js";

describe("Application", () => {
    let applicationTree;
    const testChildText = `This text should exist.`;

    it("should be available", () => {
        expect(Application).to.exist;
    });

    context("render", () => {
        before(() => {
            applicationTree = testTree(
                <Application>
                    <div>{testChildText}</div>
                </Application>
            );
        });

        it("should render correctly", () => {
            expect(applicationTree).to.exist;
            expect(applicationTree.isMounted()).to.be.true;
            expect(applicationTree).to.respondTo("get");
        });

        context("refs", () => {
            it("header", () => {
                const headerRef = applicationTree.get("header");
                expect(headerRef).to.exist;
            });

            it("main", () => {
                const mainRef = applicationTree.get("main");
                expect(mainRef).to.exist;
            });

            it("navigation", () => {
                const navigationRefCollection = applicationTree.get("navigation");
                expect(navigationRefCollection).to.exist;
                expect(navigationRefCollection).to.have.length.of(6);
            });
        });

        it("should render children", () => {
            const mainRef = applicationTree.get("main");
            expect(mainRef).to.exist;

            expect(mainRef.innerText).to.equal(testChildText);
        });

        after(() => {
            applicationTree.dispose();
        });
    });
});

