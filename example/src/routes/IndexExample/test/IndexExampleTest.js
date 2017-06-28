import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";

import IndexExample from "../IndexExample.js";
import * as indexExampleRoutes from "../routes.js";

describe("Index Example", () => {
    it("is available", () => {
        expect(IndexExample).to.exist;
    });

    describe("render", () => {
        it("renders correctly", () => {
            const indexExample = shallow(
                <IndexExample />
            );

            expect(indexExample).to.exist;
        });

        it("renders #index element", () => {
            const indexExample = shallow(
                <IndexExample />
            );

            expect(indexExample.find(`#index`))
                .to.have.length.of(1);
        });
    });

    describe("routes", () => {
        it("has a defined path", () => {
            expect(indexExampleRoutes).to.exist;

            // Index routes should not have a path
            expect(indexExampleRoutes)
                .to.not.have.property("path");
        });

        it("asynchronously fetches component", (done) => {
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
