"use strict";

const serverRender = require("./utils/serverRender.js");
const getDomainRoutes = require("./utils/getDomainRoutes.js");

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
        const header = request.header;
        const url = request.url;

        const serverHistory = useRouterHistory(createMemoryHistory)();
        const serverLocation = serverHistory.createLocation(url);

        cfg = Object.assign({}, cfg, {
            cookies,
            history: serverHistory,
            location: serverLocation,
            request,
            wildcatConfig
        });

        if (!cfg.routes && cfg.domains) {
            return new Promise((resolve, reject) => {
                getDomainRoutes(cfg.domains, header, (error, routes) => {
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
