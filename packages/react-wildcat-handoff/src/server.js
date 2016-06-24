"use strict";

const serverRender = require("./utils/serverRender.js");
const getDomainRoutes = require("./utils/getDomainRoutes.js");
const cookie = require("cookie");

const createMemoryHistory = require("history").createMemoryHistory;
const useRouterHistory = require("react-router").useRouterHistory;

function completeRender(cfg, routes) {
    if (routes) {
        cfg.routes = routes;
    }

    return serverRender(cfg);
}

function render(cfg) {
    return function serverHandoff(request, cookies, wildcatConfig) {
        const headers = {
            cookies: cookie.parse(request.header.cookie || ""),
            host: request.header.host,
            protocol: request.protocol,
            referrer: request.header.referer,
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
