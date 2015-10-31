"use strict";

const WebSocket = require("ws");
let retryCount = 0;

module.exports = function connectToWebSocketServer(options) {
    const cluster = options.cluster;
    const cpuCount = options.cpuCount;
    const logger = options.logger;
    const maxRetries = options.maxRetries;
    const retryTimer = options.retryTimer;
    const routeCache = options.cache;
    const socketUrl = options.url;

    const socket = new WebSocket(socketUrl);

    socket.on("open", () => {
        if (cluster.worker.id === cpuCount) {
            logger.meta(`Listening to socket server at ${socketUrl}.`);
        }
    });

    socket.on("error", () => {
        if (cluster.worker.id === cpuCount) {
            if (retryCount < maxRetries) {
                logger.warn(`No socket server found at ${socketUrl}. Retrying in ${retryTimer / 1000}s. (${++retryCount}/${maxRetries})`);
                return setTimeout(() => connectToWebSocketServer(options), retryTimer);
            }

            return logger.error(`Could not find socket server.`);
        }
    });

    socket.on("message", (message) => {
        message = JSON.parse(message);
        var modulePath = message.data;

        switch (message.event) {
            case "filechange":
                Object.keys(routeCache).forEach(route => {
                    const routePackageCache = routeCache[route].packageCache;

                    if (Array.isArray(routePackageCache) && routePackageCache.indexOf(modulePath) !== -1) {
                        logger.info(`expiring cache for`, route, cluster.worker.id);
                        delete routeCache[route];
                    }
                });
                break;
        }
    });
};
