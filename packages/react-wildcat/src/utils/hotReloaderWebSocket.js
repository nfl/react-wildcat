// WebSocket polyfill for Node
const WebSocket = require("ws/lib/WebSocket.js");

module.exports = function hotReloaderWebSocket(hotReloader, socketUrl) {
    var socket = new WebSocket(socketUrl);

    socket.addEventListener("open", function socketOpen() {
        console.info(`Listening to socket server at ${socketUrl}.`);
    });

    socket.addEventListener("error", function socketError() {
        console.warn(`No socket server found at ${socketUrl}.`);
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
};
