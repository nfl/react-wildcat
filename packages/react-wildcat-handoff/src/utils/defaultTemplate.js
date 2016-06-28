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
    const serviceWorker = clientSettings.serviceWorker;
    const enablePreboot = clientSettings.enablePreboot;

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

        <link rel="prefetch" href="${staticUrl}/jspm_packages/system.js" />
        <link rel="prefetch" href="${staticUrl}/system.config.js" />
        ${enablePreboot ? `<link rel="prefetch" href="${staticUrl}/static/preboot.js" />` : ``}
        ${__PROD__ ? `<link rel="prefetch" href="${staticUrl}/bundles/react.js" />` : ``}

        ${enablePreboot ? `<script src="/preboot.js"></script>` : ``}

        ${helmetTags.join(``)}
    </head>
    <body>
        <div id="${reactRootElementID}">${html}</div>

        ${serviceWorker ? `
        <script src="/register-sw.js"></script>
        ` : `
        <script>
            // Remove any registered service workers (dev mode only)
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var registration of registrations) {
                        registration.unregister();
                    }
                    if (registrations.length > 0) {
                        window.location.reload();
                    }
                })
            }
        </script>
        `}
        <script>
            __INITIAL_DATA__ = ${JSON.stringify(data)};
            __REACT_ROOT_ID__ = "${reactRootElementID}";
        </script>

        <script src="${staticUrl}/jspm_packages/system.js"></script>

        <script>
            System.config({
                baseURL: "${staticUrl}",
                trace: ${hotReload},
                production: ${__PROD__}
            });
        </script>

        ${indexedDBModuleCache ? `<script src="//npmcdn.com/dexie@1.3.3/dist/dexie.min.js"></script>
        <script>
            (function () {
                var db = new Dexie("jspm");

                db.version(1).stores({
                    files: "&url,format,hash,contents,timestamp"
                });

                db.open();

                var log = console.error.bind(console);
                var timestamp = ${NOW};

                function hash(str) {
                    // Source: http://stackoverflow.com/a/7616484/502126
                    var hash = 0, i, chr, len;

                    if (str.length === 0) {
                        return hash;
                    }

                    for (i = 0, len = str.length; i < len; i++) {
                        chr = str.charCodeAt(i);
                        hash = ((hash << 5) - hash) + chr;
                        hash |= 0;
                    }

                    return hash.toString();
                }

                var cachedCall = function (loader, load, file, originalFunction) {
                    return db.files.where("url").equals(file.url).first().then(function (cached) {
                        if (System.hot || !cached || cached.timestamp < timestamp || cached.hash !== file.hash) {
                            if (cached && cached.hash !== file.hash) {
                                console.info("Updating", file.url, "in client-side cache.");
                            }

                            return originalFunction.apply(loader, [load]).then(function (translated) {
                                file.format = load.metadata.format;
                                file.contents = translated;
                                file.timestamp = Date.now();

                                return db.files.put(file).then(function () {
                                    return translated;
                                }).catch(log);
                            });
                        }

                        load.metadata.format = cached.format || undefined;
                        return cached.contents;
                    }).catch(log);
                };

                // override fetch
                System.originalFetch = System.fetch;
                System.fetch = function (load) {
                    var file = {
                        url: "load_" + load.address,
                        hash: hash(load.address)
                    };

                    return cachedCall(this, load, file, System.originalFetch);
                };

                // override translate
                System.originalTranslate = System.translate;
                System.translate = function (load) {
                    if (!load.metadata.deps) {
                        load.metadata.deps = []; // avoid https://github.com/systemjs/systemjs/pull/1158
                    }

                    var file = {
                        url: "translate_" + load.address,
                        hash: hash(load.source)
                    };

                    return cachedCall(this, load, file, System.originalTranslate);
                };
            }());
        </script>` : ``}

        <script>
            // FIXME: Possibly not needed in jspm 0.17
            // store the old normalization function
            var systemNormalize = System.normalize;

            // override the normalization function
            System.normalize = function normalize(name, parentName, parentAddress) {
                return systemNormalize.call(this, name, parentName, parentAddress).then(
                    function normalizeCallback(url) {
                        if (
                            // name includes extension
                            name.indexOf(".") !== -1 &&

                            // name is one of...
                            (/\\.(?:css|eot|gif|jpe?g|json|otf|png|swf|svg|ttf|woff)\.js$/).test(url)
                        ) {
                            return url.replace(/\.js$/, "");
                        }

                        return url;
                    }
                );
            };
        </script>

        <script src="${staticUrl}/system.config.js"></script>
        ${__PROD__ ? `<script src="${staticUrl}/bundles/react.js"></script>` : ``}

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
                })${enablePreboot ? `.then(function prebootComplete() {
                    return System.import("preboot").then((Preboot) => { 
                        return Preboot.preboot.complete(); 
                    });
                })` : ``}${hotReload ? `.then(function hotReloadFlag() {
                    // Flag hot reloading
                    System.hot = true;
                })` : ``}
                .catch(console.error.bind(console));
        </script>
    </body>
</html>
`.trim();
};
