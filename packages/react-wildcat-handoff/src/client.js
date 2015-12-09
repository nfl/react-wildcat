require("isomorphic-fetch");

var history = require("history");
var clientRender = require("./utils/clientRender.js");
var getDomainRoutes = require("./utils/getDomainRoutes.js");

var createHistory = history.createHistory;
var createLocation = history.createLocation;

function completeRender(cfg, routes) {
    if (routes) {
        cfg.routes = routes;
    }

    return clientRender(cfg);
}

function render(cfg) {
    var clientHistory = createHistory();
    var clientLocation = createLocation(location.pathname);

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
