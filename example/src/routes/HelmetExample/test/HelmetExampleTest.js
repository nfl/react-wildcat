import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";

import HelmetExample from "../HelmetExample.js";
import * as helmetExampleRoutes from "../routes.js";

describe("Helmet Example", () => {
    const helmetExamplePath = "/helmet-example";

    it("is available", () => {
        expect(HelmetExample).to.exist;
    });

    context("render", () => {
        it("renders correctly", () => {
            const helmetExample = shallow(
                <HelmetExample />
            );

            expect(helmetExample).to.exist;
        });

        it("renders #helmet element", () => {
            const helmetExample = shallow(
                <HelmetExample />
            );

            expect(helmetExample.find(`#helmet`))
                .to.have.length.of(1);
        });
    });

    context("routes", () => {
        it("has a defined path", () => {
            expect(helmetExampleRoutes).to.exist;
            expect(helmetExampleRoutes)
                .to.have.property("path")
                .that.is.a("string")
                .that.equals(helmetExamplePath);
        });

        it("asynchronously fetches component", (done) => {
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
