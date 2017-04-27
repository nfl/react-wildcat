const serverRender = require("./utils/serverRender.js");
const getDomainRoutes = require("./utils/getDomainRoutes.js");
const cookie = require("cookie");

const createMemoryHistory = require("history").createMemoryHistory;
const useRouterHistory = require("react-router").useRouterHistory;

function completeRender(cfg, routes) {
    if (routes) {
        cfg = Object.assign({}, cfg, {
            routes
        });
    }

    return serverRender(cfg);
}

function render(cfg) {
    return function serverHandoff(request, cookies, wildcatConfig) {
        const headers = {
            cookies: cookie.parse(request.header.cookie || ""),
            host: request.header.host,
            href: `${request.protocol}://${request.header.host}${request.url}`,
            method: request.method,
            pathname: request.url,
            protocol: request.protocol,
            referrer: request.header.referer,
            search: `?${request.url.split("?")[1] || ""}`,
            userAgent: request.header["user-agent"] || "*"
        };

        const serverHistory = useRouterHistory(createMemoryHistory)();
        const serverLocation = serverHistory.createLocation(
            Object.assign({}, serverHistory.createLocation(request.url), {
                state: headers
            })
        );

        cfg = Object.assign({}, cfg, {
            headers,
            history: serverHistory,
            location: serverLocation,
            request,
            wildcatConfig
        });

        if (typeof cfg.routes === "function") {
            return new Promise(function routePromise(resolve, reject) {
                cfg.routes(cfg.location, function renderCallback(err, routes) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(completeRender(cfg, routes));
                });
            });
        }

        if (!cfg.routes && cfg.domains) {
            return new Promise((resolve, reject) => {
                getDomainRoutes(cfg.domains, headers, (error, routes) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(completeRender(cfg, routes));
                });
            });
        }

        return completeRender(cfg);
    };
}

module.exports = function server(cfg) {
    return render(cfg);
};
