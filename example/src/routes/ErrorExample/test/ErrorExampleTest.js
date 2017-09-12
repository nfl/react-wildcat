import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";

import ErrorExample from "../ErrorExample.js";
import * as errorExampleRoutes from "../routes.js";

describe("Error Example", () => {
    const errorExamplePath = "/error-example";

    it("is available", () => {
        expect(ErrorExample).to.exist;
    });

    describe("render", () => {
        const errorRender = () => shallow(<ErrorExample />);

        it("throws a render error", () => {
            expect(errorRender).to.throw(TypeError, "this.props");
        });
    });

    describe("routes", () => {
        it("has a defined path", () => {
            expect(errorExampleRoutes).to.exist;
            expect(errorExampleRoutes)
                .to.have.property("path")
                .that.is.a("string")
                .that.equals(errorExamplePath);
        });

        it("asynchronously fetches component", done => {
            expect(errorExampleRoutes).to.exist;
            expect(errorExampleRoutes).to.respondTo("getComponent");

            errorExampleRoutes.getComponent(location, (err, module) => {
                expect(err).to.be.null;

                expect(module).to.exist;
                expect(module).to.be.a("function");
                expect(module).to.equal(ErrorExample);

                done();
            });
        });
    });
});
