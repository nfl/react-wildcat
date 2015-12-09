"use strict";

var ReactDOM = require("react-dom");
var Router = require("react-router");
var clientContext = require("./clientContext.js");

var match = Router.match;
var __REACT_ROOT_ID__ = "__REACT_ROOT_ID__";

module.exports = function clientRender(cfg) {
    var component = clientContext(cfg);

    return new Promise(function clientRenderPromise(resolve) {
        match(cfg, function clientRenderMatch() {
            var reactRootElementID = window[__REACT_ROOT_ID__];
            var reactRootElement = document.getElementById(reactRootElementID);

            ReactDOM.render(component, reactRootElement);

            // Flag react as available
            // This is a helpful hook for running tests
            reactRootElement.setAttribute("data-react-available", true);

            resolve([reactRootElement, component]);
        });
    });
};
