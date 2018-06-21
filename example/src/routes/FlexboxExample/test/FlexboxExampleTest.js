import React from "react";
import Enzyme, {shallow} from "enzyme";
import {TestMode} from "radium";
import {expect} from "chai";
import Adapter from "enzyme-adapter-react-16";

import FlexboxExample from "../FlexboxExample.js";
import * as flexboxExampleRoutes from "../routes.js";

Enzyme.configure({adapter: new Adapter()});

describe("Flexbox Example", () => {
    const flexboxExamplePath = "/flexbox-example";

    it("is available", () => {
        expect(FlexboxExample).to.exist;
    });

    describe("render", () => {
        beforeAll(() => {
            TestMode.enable();
        });

        it("renders correctly", () => {
            const flexboxExample = shallow(<FlexboxExample />);

            expect(flexboxExample).to.exist;
        });

        it("renders #flexbox element", () => {
            const flexboxExample = shallow(<FlexboxExample />);

            expect(flexboxExample.find(`#flexbox`)).to.have.length.of(1);
        });

        afterAll(() => {
            TestMode.disable();
        });
    });

    describe("routes", () => {
        it("has a defined path", () => {
            expect(flexboxExampleRoutes).to.exist;
            expect(flexboxExampleRoutes)
                .to.have.property("path")
                .that.is.a("string")
                .that.equals(flexboxExamplePath);
        });

        it("asynchronously fetches component", done => {
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
