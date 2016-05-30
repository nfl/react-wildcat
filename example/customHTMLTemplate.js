"use strict";

const NOW = Date.now();
const __PROD__ = process.env.NODE_ENV === "production";

module.exports = function defaultTemplate(cfg) {
    const data = cfg.data;
    const head = cfg.head;
    const html = cfg.html;

    const wildcatConfig = cfg.wildcatConfig;
    const clientSettings = wildcatConfig.clientSettings;
    const generalSettings = wildcatConfig.generalSettings;

    const entry = clientSettings.entry;
    const hotReload = clientSettings.hotReload;
    const hotReloader = clientSettings.hotReloader;
    const renderHandler = clientSettings.renderHandler;
    const reactRootElementID = clientSettings.reactRootElementID;
    const indexedDBModuleCache = clientSettings.indexedDBModuleCache;

    const staticUrl = generalSettings.staticUrl;
    const socketUrl = staticUrl.replace("http", "ws");

    const helmetTags = Object.keys(head)
        .filter(meta => meta !== "htmlAttributes")
        .map(meta => head[meta].toString().trim());

    return `
<!doctype html>
<html ${head.htmlAttributes.toString()}>
    <head>
        <link rel="dns-prefetch" href="${staticUrl}" />
        <link rel="preconnect" href="${staticUrl}" />
        ${helmetTags.join(``)}
    </head>
    <body>
        <div id="${reactRootElementID}">${html}</div>

        <script>
            __INITIAL_DATA__ = ${JSON.stringify(data)};
            __REACT_ROOT_ID__ = "${reactRootElementID}";
        </script>

        <script src="${staticUrl}/public/main-bundle.js"></script>

        <script>
            Promise.all([
                System.import("${entry}"),
                System.import("${renderHandler}")${hotReload ? `,
                System.import("${hotReloader}")` : ""}
            ])
                .then(function clientEntry(responses) {
                    // First response is a hash of project options
                    var clientOptions = responses[0];

                    // Second response is the handoff to the client
                    var client = responses[1];${hotReload ? `

                    // Third response is our hot reloader
                    var HotReloader = responses[2];

                    if (HotReloader) {
                        function bootstrapHotReloader(hotReloader, socketUrl) {
                            var socket = new WebSocket(socketUrl);

                            socket.addEventListener("open", function socketOpen() {
                                console.info("Listening to socket server at ${socketUrl}.");
                            });

                            socket.addEventListener("error", function socketError() {
                                console.warn("No socket server found at ${socketUrl}.");
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
                        }

                        const hotReloader = new HotReloader();
                        bootstrapHotReloader(hotReloader, "${socketUrl}");
                    }` : ""}
                    // Pass options to server
                    return client(clientOptions);
                })
                ${hotReload? `.then(function hotReloadFlag() {
                    // Flag hot reloading
                    System.hot = true;
                })` : ``}
                .catch(console.error.bind(console));
        </script>
    </body>
</html>
`.trim();
};
