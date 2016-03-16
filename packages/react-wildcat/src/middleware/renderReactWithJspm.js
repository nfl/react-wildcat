module.exports = function renderReactWithJspm(root, options) {
    "use strict";

    const logger = options.logger;
    const wildcatConfig = options.wildcatConfig;

    const customLoader = require("../utils/customJspmLoader")(root, wildcatConfig);
    const hotReloaderWebSocket = require("../utils/hotReloaderWebSocket");
    const __PROD__ = (process.env.NODE_ENV === "production");

    let isCustomized = false;

    function customizeJspmLoader() {
        if (isCustomized) {
            return Promise.resolve(customLoader);
        }

        const generalSettings = wildcatConfig.generalSettings;
        const serverSettings = wildcatConfig.serverSettings;

        // store the old normalization function
        const systemNormalize = customLoader.normalize;

        // Load remote config
        return Promise.all([
            customLoader.import(generalSettings.jspmConfigFile),
            serverSettings.hotReload ? customLoader.import(serverSettings.hotReloader) : Promise.resolve()
        ])
            .then(function jspmConfigImportHandler(responses) {
                const HotReloader = responses[1];

                if (HotReloader) {
                    const hotReloader = new HotReloader(customLoader, logger);

                    if (typeof serverSettings.hotReloadReporter === "function") {
                        serverSettings.hotReloadReporter(hotReloader, generalSettings.staticUrl);
                    } else {
                        const socketUrl = generalSettings.staticUrl.replace(/http/, "ws");
                        hotReloaderWebSocket(hotReloader, socketUrl);
                    }
                }

                // FIXME: Possibly not needed in jspm 0.17
                // override the normalization function
                function customNormalize(name, parentName, parentAddress) {
                    return systemNormalize.call(this, name, parentName, parentAddress).then(
                        function normalizeCallback(url) {
                            if ((/\.(?:css|eot|gif|jpe?g|json|otf|png|swf|svg|ttf|woff)\.js$/).test(url)) {
                                return url.replace(/\.js$/, "");
                            }

                            return url;
                        }
                    );
                }

                customLoader.config({
                    normalize: customNormalize
                });

                isCustomized = true;
                return customLoader;
            });
    }

    function pageHandler(request, cookies) {
        // Set up jspm to use our custom fetch implementation
        return customizeJspmLoader(wildcatConfig)
            .then(function customJspmLoader(loader) {
                // Store a pristine package array to map packages to page requests
                const serverSettings = wildcatConfig.serverSettings;

                // Load the server files from the current file system
                const entry = serverSettings.entry;
                const renderHandler = serverSettings.renderHandler;

                return Promise.all([
                    // Entry value can be an async import, a hash of options, or falsy
                    (typeof entry === "string") ? loader.import(entry) : Promise.resolve(entry),
                    loader.import(renderHandler)
                ])
                    .then(function serverEntry(responses) {
                        // First response is a hash of project options
                        const serverOptions = responses[0];

                        // Second response is the handoff to the server
                        const server = responses[1];

                        // Pass options to server
                        return server(serverOptions);
                    })
                    .then(function serverRender(render) {
                        return render(request, cookies, wildcatConfig);
                    })
                    .then(function serverReply(reply) {
                        return {
                            // Return the original reply
                            reply
                        };
                    })
                    .catch(function serverError(err) {
                        if (!__PROD__) {
                            const blueBoxOfDeath = require("../utils/blueBoxOfDeath");

                            return {
                                reply: {
                                    error: blueBoxOfDeath(err, request),
                                    status: 500
                                }
                            };
                        }

                        return {
                            reply: {
                                error: err.stack,
                                status: 500
                            }
                        };
                    });
            });
    }

    return function* render() {
        const cookies = this.cookies;
        const request = this.request;
        const response = this.response;

        response.status = 200;
        response.type = "text/html";

        var reply;

        const data = yield pageHandler(request, cookies);
        reply = data.reply;

        if (reply.type) {
            response.type = reply.type;
        }

        if (reply.status) {
            this.status = reply.status;
        }

        if (reply.redirect === true) {
            const redirectLocation = reply.redirectLocation;
            return this.redirect(`${redirectLocation.pathname}${redirectLocation.search}`);
        }

        if (reply.error) {
            return this.body = reply.error;
        }

        return this.body = reply.html;
    };
};
