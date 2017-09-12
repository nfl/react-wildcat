/*  eslint-disable indent */
import React from "react";
import {shallow} from "enzyme";
import {TestMode} from "radium";
import {expect} from "chai";

import {ApplicationComponent as Application} from "../Application.js";
import ApplicationContext from "../ApplicationContext.js";

describe("Application", () => {
    const testChildText = "This text should exist.";

    it("component is available", () => {
        expect(Application).to.exist;
    });

    describe("render", () => {
        beforeAll(() => {
            TestMode.enable();
        });

        it("renders <Application />", () => {
            const application = shallow(
                <ApplicationContext>
                    <Application />
                </ApplicationContext>,
                {
                    context: {
                        headers: {
                            host: window.location.host,
                            userAgent: window.navigator.userAgent
                        }
                    }
                }
            );

            expect(application).to.exist;
        });

        it("renders a list of links", () => {
            const application = shallow(<Application />);

            expect(
                application.find(`nav[role="navigation"]`)
            ).to.have.length.of(1);
        });

        it("renders children when passed in", () => {
            const application = shallow(
                <Application>
                    <div>{testChildText}</div>
                </Application>
            );

            expect(application.contains(<div>{testChildText}</div>)).to.be.true;
        });

        afterAll(() => {
            TestMode.disable();
        });
    });
});
