require("isomorphic-fetch");

var clientRender = require("./utils/clientRender.js");
var getDomainRoutes = require("./utils/getDomainRoutes.js");
var cookie = require("cookie");

var createHistory = require("history").createHistory;
var useRouterHistory = require("react-router").useRouterHistory;

function completeRender(cfg, routes) {
    if (routes) {
        cfg.routes = routes;
    }

    return clientRender(cfg);
}

function render(cfg) {
    var headers = {
        cookies: cookie.parse(document.cookie),
        host: window.location.host,
        protocol: window.location.protocol,
        referrer: document.referrer,
        userAgent: window.navigator.userAgent
    };

    var clientHistory = useRouterHistory(createHistory)();
    var clientLocation = clientHistory.createLocation(
        Object.assign({}, location, {
            state: headers
        })
    );

    cfg = Object.assign({}, cfg, {
        headers: headers,
        history: clientHistory,
        location: clientLocation
    });

    if (!cfg.routes && cfg.domains) {
        return new Promise(function renderPromise(resolve, reject) {
            getDomainRoutes(cfg.domains, headers, function renderCallback(err, routes) {
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
