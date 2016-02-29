import React from "react";
import testTree from "react-test-tree";

import ErrorExample from "../ErrorExample.js";
import * as errorExampleRoutes from "../routes.js";

describe("Error Example", () => {
    const errorExamplePath = "/error-example";

    it("should be available", () => {
        expect(ErrorExample).to.exist;
    });

    context("render", () => {
        const errorRender = () => testTree(
            <ErrorExample />
        );

        it("should throw a render error", () => {
            expect(errorRender)
                .to.throw(TypeError, "this.props");
        });
    });

    context("routes", () => {
        it("should have a defined path", () => {
            expect(errorExampleRoutes).to.exist;
            expect(errorExampleRoutes)
                .to.have.property("path")
                .that.is.a("string")
                .that.equals(errorExamplePath);
        });

        it("should asynchronously fetch component", (done) => {
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

