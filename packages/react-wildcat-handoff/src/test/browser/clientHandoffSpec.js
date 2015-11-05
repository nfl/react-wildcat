"use strict";

var client = require("../../client.js");

const React = require("react");
const Router = require("react-router");
var stubs = {
    routes: React.createElement(
        Router.Route, {
            path: "/",
            component: exports.Application
        },

        React.createElement(Router.Redirect, {
            from: "/redirect",
            to: "/"
        })
    )
};

/* eslint-disable max-nested-callbacks */
describe("react-wildcat-handoff/client", function () {
    it("exists", function () {
        expect(client).to.exist;

        expect(client)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("client");
    });

    context.skip("routing", function () {
        it("matches routes", function (done) {
            var clientHandoff = client(stubs.routes)
                .then(function (response) {
                    expect(response).to.exist;
                    console.log(response);

                    done();
                })
                .catch(function (error) {
                    done(error);
                });

            expect(clientHandoff)
                .to.be.an.instanceof(Promise);
        });
    });
});
