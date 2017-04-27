require("isomorphic-fetch");

var clientRender = require("./utils/clientRender.js");
var getDomainRoutes = require("./utils/getDomainRoutes.js");
var cookie = require("cookie");

var createHistory = require("history").createHistory;
var useRouterHistory = require("react-router").useRouterHistory;

function completeRender(cfg, routes) {
    if (routes) {
        cfg = Object.assign({}, cfg, {
            routes: routes
        });
    }

    return clientRender(cfg);
}

function render(cfg) {
    var headers = {
        cookies: cookie.parse(document.cookie),
        host: window.location.host,
        href: window.location.href,
        method: null,
        pathname: window.location.pathname,
        protocol: window.location.protocol,
        referrer: document.referrer,
        search: window.location.search,
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

    if (typeof cfg.routes === "function") {
        return new Promise(function routePromise(resolve, reject) {
            cfg.routes(cfg.location, function renderCallback(err, routes) {
                if (err) {
                    return reject(new Error(err));
                }

                return resolve(completeRender(cfg, routes));
            });
        });
    }

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
