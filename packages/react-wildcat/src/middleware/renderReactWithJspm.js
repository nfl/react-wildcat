module.exports = function renderReactWithJspm(root, options) {
    "use strict";

    const logger = options.logger;
    const wildcatConfig = options.wildcatConfig;

    const generalSettings = wildcatConfig.generalSettings;
    const serverSettings = wildcatConfig.serverSettings;

    const customJspmLoader = require("../utils/customJspmLoader");

    let isBootstrapped = false;
    let hotReloaderInstance;

    function bootstrapLoader(customizedLoader) {
        return isBootstrapped ? Promise.resolve() : Promise.all([
            customizedLoader.import(generalSettings.jspmConfigFile),
            serverSettings.hotReload ? customizedLoader.import(serverSettings.hotReloader) : Promise.resolve()
        ])
            .then(function jspmConfigImportHandler(responses) {
                const HotReloader = responses[1];

                if (HotReloader && !hotReloaderInstance) {
                    hotReloaderInstance = new HotReloader({
                        customizedLoader,
                        logger
                    });

                    if (typeof serverSettings.hotReloadReporter === "function") {
                        serverSettings.hotReloadReporter(hotReloaderInstance, generalSettings.staticUrl);
                    } else {
                        const hotReloaderWebSocket = require("../utils/hotReloaderWebSocket");

                        const socketUrl = generalSettings.staticUrl.replace(/http/, "ws");
                        hotReloaderWebSocket(hotReloaderInstance, socketUrl);
                    }
                }

                isBootstrapped = true;
            });
    }

    function pageHandler(request, cookies) {
        const customizedLoader = customJspmLoader(root, options);

        // Load remote config
        return bootstrapLoader(customizedLoader)
            .then(function customizedJspmLoader() {
                // Load the server files from the current file system
                const entry = serverSettings.entry;
                const renderHandler = serverSettings.renderHandler;

                return Promise.all([
                    // Entry value can be an async import, a hash of options, or falsy
                    (typeof entry === "string") ? customizedLoader.import(entry) : Promise.resolve(entry),
                    customizedLoader.import(renderHandler)
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
                    });
            })
            .catch(function serverError(err) {
                logger.error(err);

                if (serverSettings.displayBlueBoxOfDeath) {
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
                        error: err.stack || err,
                        status: 500
                    }
                };
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
