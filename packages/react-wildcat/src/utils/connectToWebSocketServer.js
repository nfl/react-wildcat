"use strict";

const WebSocket = require("ws");
let retryCount = 0;

module.exports = function connectToWebSocketServer(root, options) {
    const customLoader = require("./customJspmLoader")(root);

    const cluster = options.cluster;
    const cpuCount = options.cpuCount;
    const logger = options.logger;
    const maxRetries = options.maxRetries;
    const retryTimer = options.retryTimer;
    const routeCache = options.cache;
    const socketUrl = options.url;

    const socket = new WebSocket(socketUrl);

    socket.on("open", function socketOpen() {
        if (cluster.worker.id === cpuCount) {
            logger.meta(`Listening to socket server at ${socketUrl}.`);
        }
    });

    socket.on("error", function socketError() {
        if (cluster.worker.id === cpuCount) {
            if (retryCount < maxRetries) {
                logger.warn(`No socket server found at ${socketUrl}. Retrying in ${retryTimer / 1000}s. (${++retryCount}/${maxRetries})`);
                return setTimeout(function socketTimeout() {
                    connectToWebSocketServer(options);
                }, retryTimer);
            }

            return logger.error(`Could not find socket server.`);
        }
    });

    // TODO: Refactor per-route cache expiration
    socket.on("message", function socketMessage(message) {
        message = JSON.parse(message);
        const modulePath = message.data;

        switch (message.event) {
            case "filechange":
                if (routeCache && routeCache.size > 0) {
                    logger.info(`expiring route cache`, cluster.worker.id);

                    customLoader.delete(modulePath);
                    routeCache.clear();
                }

                break;
        }
    });
};
