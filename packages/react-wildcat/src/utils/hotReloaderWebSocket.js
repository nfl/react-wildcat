// WebSocket polyfill for Node
const WebSocket = require("ws/lib/WebSocket.js");

module.exports = function hotReloaderWebSocket(hotReloader, socketUrl, logger) {
    var socket = new WebSocket(socketUrl);

    socket.addEventListener("open", function socketOpen() {
        logger.info(`Listening to socket server at ${socketUrl}.`);
    });

    socket.addEventListener("error", function socketError(err) {
        if (err.code === "EADDRNOTAVAIL") {
            return logger.warn(`No socket server found at ${socketUrl}.`);
        }

        return logger.error(err);
    });

    socket.addEventListener("message", function socketMessage(messageEvent) {
        var message = JSON.parse(messageEvent.data);
        var moduleName = message.data;

        switch (message.event) {
            case "filechange":
                hotReloader.onFileChanged.call(hotReloader, moduleName);
                break;
        }
    });

    return socket;
};
