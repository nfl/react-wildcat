"use strict";

const history = require("history");
const renderContext = require("./utils/renderContext.js");
const getDomainRoutes = require("./utils/getDomainRoutes.js");

const createLocation = history.createLocation;
const createMemoryHistory = history.createMemoryHistory;

function completeRender(cfg, routes) {
    if (routes) {
        cfg.routes = routes;
    }

    return renderContext(cfg);
}

function render(cfg) {
    return (request, cookies, wildcatConfig) => {
        const header = request.header;
        const url = request.url;

        const serverHistory = createMemoryHistory();
        const serverLocation = createLocation(url);

        cfg = Object.assign({}, cfg, {
            cookies: cookies,
            history: serverHistory,
            location: serverLocation,
            request: request,
            wildcatConfig: wildcatConfig
        });

        if (!cfg.routes && cfg.domains) {
            return getDomainRoutes(cfg.domains, header, (err, routes) => {
                if (err) {
                    throw new Error(err);
                }

                return completeRender(cfg, routes);
            });
        }

        return completeRender(cfg);
    };
}

module.exports = function server(cfg) {
    return render(cfg);
};
