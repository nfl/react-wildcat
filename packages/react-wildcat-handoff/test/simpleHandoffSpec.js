"use strict";

const chai = require("chai");
const expect = chai.expect;

const simple = require("../src/simple.js");
const stubs = require("./stubFixtures.js");

/* eslint-disable max-nested-callbacks */
describe("react-wildcat-handoff/simple", () => {
    it("exists", () => {
        expect(simple).to.exist;

        expect(simple)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("simple");
    });

    context("response", () => {
        it("returns HTML on a route", (done) => {
            const simpleHandoff = simple(stubs.routes);

            expect(simpleHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("simpleHandoff");

            const result = simpleHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string");

                    done();
                })
                .catch(error => done(error));

            expect(result)
                .to.be.an.instanceof(Promise);
        });

        it("adds a WebSocket listener on the client in development mode", (done) => {
            const existingEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = "development";

            const simpleHandoff = simple(stubs.routes);

            expect(simpleHandoff)
                .to.be.a("function")
                .that.has.property("name")
                .that.equals("simpleHandoff");

            const result = simpleHandoff(stubs.requests.basic, stubs.cookieParser, stubs.wildcatConfig)
                .then(response => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("html")
                        .that.is.a("string")
                        .that.has.string(stubs.developmentPayload);

                    process.env.NODE_ENV = existingEnv;
                    done();
                })
                .catch(error => done(error));

            expect(result)
                .to.be.an.instanceof(Promise);
        });
    });
});
