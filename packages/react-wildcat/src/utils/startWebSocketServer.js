"use strict";

const WebSocketServer = require("uws").Server;
const chokidar = require("chokidar");

function send(eventName, response, client) {
    return client.send(JSON.stringify({
        event: eventName,
        data: response
    }));
}

module.exports = function startWebSocketServer(root, {
    cache,
    server,
    watchOptions
}) {
    const wss = new WebSocketServer({
        server
    });

    const watcher = chokidar.watch(root, watchOptions)
        .on("change", function fileWatcher(filename) {
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

    return {
        watcher,
        server: wss
    };
};
