"use strict";

var ReactDOM = require("react-dom");
var Router = require("react-router");
var clientContext = require("./clientContext.js");

var match = Router.match;
var __REACT_ROOT_ID__ = "__REACT_ROOT_ID__";

module.exports = function clientRender(cfg) {
    var headers = cfg.headers;

    return new Promise(function clientRenderPromise(resolve) {
        match({
            history: cfg.history,
            location: cfg.location,
            routes: cfg.routes
        }, function clientRenderMatch(error, redirectLocation, renderProps) {
            var component = clientContext(cfg, headers, renderProps);

            var reactRootElementID = window[__REACT_ROOT_ID__];
            var reactRootElement = document.getElementById(reactRootElementID);

            ReactDOM.render(component, reactRootElement, function addReactHook() {
                // Flag react as available
                // This is a helpful hook for running tests
                reactRootElement.setAttribute("data-react-available", true);
                resolve([reactRootElement, component]);
            });
        });
    });
};
