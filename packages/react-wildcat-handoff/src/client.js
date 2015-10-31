require("isomorphic-fetch");
var ReactDOM = require("react-dom");

var history = require("history");
var clientRouter = require("./utils/clientRouter.js");
var getDomainRoutes = require("./utils/getDomainRoutes.js");

var createHistory = history.createHistory;
var __REACT_ROOT_ID__ = "__REACT_ROOT_ID__";

function completeRender(cfg, routes) {
    if (routes) {
        cfg.routes = routes;
    }

    var component = clientRouter(cfg);
    var reactRootElementID = window[__REACT_ROOT_ID__];
    var reactRootElement = document.getElementById(reactRootElementID);

    ReactDOM.render(component, reactRootElement);

    // Flag react as available
    // This is a helpful hook for running tests
    reactRootElement.setAttribute("data-react-available", true);
}

function render(cfg) {
    cfg.history = createHistory();

    if (!cfg.routes && cfg.domains) {
        return getDomainRoutes(cfg.domains, location, function (err, routes) {
            if (err) {
                throw new Error(err);
            }

            return completeRender(cfg, routes);
        });
    }

    return completeRender(cfg);
}

module.exports = function client(cfg) {
    return render(cfg);
};
