require("isomorphic-fetch");
var ReactDOM = require("react-dom");
var Router = require("react-router");

var history = require("history");
var clientRouter = require("./utils/clientRouter.js");
var getDomainRoutes = require("./utils/getDomainRoutes.js");
var match = Router.match;

var createHistory = history.createHistory;
var createLocation = history.createLocation;
var __REACT_ROOT_ID__ = "__REACT_ROOT_ID__";

function completeRender(cfg, routes) {
    if (routes) {
        cfg.routes = routes;
    }

    var component = clientRouter(cfg);
    console.time("render");

    match(cfg, (error, redirectLocation, renderProps) => {
        // return Promise.all(
        //     renderProps.routes
        //         .filter(route => Object.keys(route).some(key => (/^get/).test(key)))
        //         .map(route => {
        //             return Promise.all(
        //                 Object.keys(route)
        //                     .filter(key => (/^get/).test(key))
        //                     .map(key => {
        //                         console.log(key, route[key]);
        //                         return new Promise(resolve => route[key](renderProps.location, resolve))
        //                     })
        //             );
        //         })
        // )
        // .then(() => {
            var reactRootElementID = window[__REACT_ROOT_ID__];
            var reactRootElement = document.getElementById(reactRootElementID);

            ReactDOM.render(component, reactRootElement);

            // Flag react as available
            // This is a helpful hook for running tests
            reactRootElement.setAttribute("data-react-available", true);
            console.timeEnd("render");
        // });
    });
}

function render(cfg) {
    cfg.history = createHistory();
    cfg.location = createLocation(location.pathname);

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
