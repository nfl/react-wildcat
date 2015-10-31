"use strict";

const WebSocketServer = require("ws").Server;
const chokidar = require("chokidar");

function send(eventName, response, client) {
    return client.send(JSON.stringify({
        event: eventName,
        data: response
    }));
}

module.exports = function connectToWebSocketServer(root, options) {
    const cache = options.cache;
    const origin = options.origin;
    const server = options.server;
    const watchOptions = options.watchOptions;

    const wss = new WebSocketServer({
        server: server
    });

    chokidar.watch(root, watchOptions).on("all", (type, filename) => {
        if ((!filename.endsWith(".gz") && !filename.endsWith(".map")) && (type === "add" || type === "change")) {
            const modulePath = filename.replace(root, origin);
            wss.clients.forEach(client => send("filechange", modulePath, client));

            if (cache[filename]) {
                wss.clients.forEach(client => send("cacheflush", filename, client));
                delete cache[filename];
            }
        }
    });
};
