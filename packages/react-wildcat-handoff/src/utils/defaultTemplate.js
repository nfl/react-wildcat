"use strict";

module.exports = function defaultTemplate(cfg) {
    const data = cfg.data;
    const head = cfg.head;
    const html = cfg.html;

    const wildcatConfig = cfg.wildcatConfig;
    const clientSettings = wildcatConfig.clientSettings;
    const generalSettings = wildcatConfig.generalSettings;

    const entry = clientSettings.entry;
    const renderHandler = clientSettings.renderHandler;
    const reactRootElementID = clientSettings.reactRootElementID;
    const staticUrl = generalSettings.staticUrl;
    const socketUrl = staticUrl.replace("http", "ws");

    const __DEV__ = (typeof process !== "undefined") && (process.env.NODE_ENV === "development");

    return `
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
    </head>
    <body>
        <div id="${reactRootElementID}">${html}</div>

        <script>
            __INITIAL_DATA__ = ${JSON.stringify(data)};
            __REACT_ROOT_ID__ = "${reactRootElementID}";
        </script>

        <script src="${staticUrl}/jspm_packages/system.js"></script>

        <script>
            System.config({
                baseURL: "${staticUrl}",
                trace: ${__DEV__}
            });
        </script>

        <script>
            // FIXME: Possibly not needed in jspm 0.17
            // store the old normalization function
            var systemNormalize = System.normalize;

            // override the normalization function
            System.normalize = function normalize(name, parentName, parentAddress) {
                return systemNormalize.call(this, name, parentName, parentAddress).then(
                    function normalizeCallback(url) {
                        if ((/\\.(?:css|eot|gif|jpe?g|json|otf|png|swf|svg|ttf|woff)\.js$/).test(url)) {
                            return url.replace(/\.js$/, "");
                        }

                        return url;
                    }
                );
            };
        </script>

        <script src="${staticUrl}/system.config.js"></script>

        <script>
            Promise.all([
                System.import("${entry}"),
                System.import("${renderHandler}")${__DEV__ ? `,
                System.import("react-wildcat-hot-reloader")` : ``}
            ])
                .then(function clientEntry(responses) {
                    // First response is a hash of project options
                    var clientOptions = responses[0];

                    // Second response is the handoff to the client
                    var client = responses[1];${__DEV__ ? `

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
                    }` : ``}

                    // Pass options to server
                    return client(clientOptions);
                })
                .catch(function clientError(err) {
                    console.error(err);
                });
        </script>
    </body>
</html>
`.trim();
};
