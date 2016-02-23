require("isomorphic-fetch");

var clientRender = require("./utils/clientRender.js");
var getDomainRoutes = require("./utils/getDomainRoutes.js");

var createHistory = require("history").createHistory;
var useRouterHistory = require("react-router").useRouterHistory;

function completeRender(cfg, routes) {
    if (routes) {
        cfg.routes = routes;
    }

    return clientRender(cfg);
}

function render(cfg) {
    var clientHistory = useRouterHistory(createHistory)();
    var clientLocation = clientHistory.createLocation(location.pathname);

    cfg.history = clientHistory;
    cfg.location = clientLocation;

    if (!cfg.routes && cfg.domains) {
        return new Promise(function renderPromise(resolve, reject) {
            getDomainRoutes(cfg.domains, location, function renderCallback(err, routes) {
                if (err) {
                    return reject(new Error(err));
                }

                return resolve(completeRender(cfg, routes));
            });
        });
    }

    return completeRender(cfg);
}

module.exports = function client(cfg) {
    return render(cfg);
};
