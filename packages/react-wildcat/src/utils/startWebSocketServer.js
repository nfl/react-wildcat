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
    const server = options.server;
    const watchOptions = options.watchOptions;

    const wss = new WebSocketServer({
        server: server
    });

    chokidar.watch(root, watchOptions).on("change", function fileWatcher(filename) {
        const modulePath = filename.replace(`${root}/`, "");

        wss.clients.forEach(function sendFileChange(client) {
            send("filechange", modulePath, client);
        });

        if (cache[filename]) {
            wss.clients.forEach(function sendCacheFlush(client) {
                send("cacheflush", filename, client);
            });

            delete cache[filename];
        }
    });
};
