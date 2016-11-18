module.exports = function renderReactWithJspm(root, options) {
    const {
        logger,
        wildcatConfig
    } = options;

    const {
        generalSettings: {
            jspmConfigFile,
            staticUrl
        },
        serverSettings: {
            displayBlueBoxOfDeath,
            entry,
            hotReload,
            hotReloader,
            hotReloadReporter,
            renderHandler
        }
    } = wildcatConfig;

    const customJspmLoader = require("../utils/customJspmLoader");

    let isBootstrapped = false;
    let hotReloaderInstance;

    function bootstrapLoader(customizedLoader) {
        return isBootstrapped ? Promise.resolve() : Promise.all([
            customizedLoader.import(jspmConfigFile),
            hotReload ? customizedLoader.import(hotReloader) : Promise.resolve()
        ])
            .then(function jspmConfigImportHandler(responses) {
                const HotReloader = responses[1];

                if (HotReloader && !hotReloaderInstance) {
                    hotReloaderInstance = new HotReloader({
                        customizedLoader,
                        logger
                    });

                    if (typeof hotReloadReporter === "function") {
                        hotReloadReporter(hotReloaderInstance, staticUrl, logger);
                    } else {
                        const hotReloaderWebSocket = require("../utils/hotReloaderWebSocket");

                        const socketUrl = staticUrl.replace(/http/, "ws");
                        hotReloaderWebSocket(hotReloaderInstance, socketUrl, logger);
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
                return Promise.all([
                    // Entry value can be an async import, a hash of options, or falsy
                    (typeof entry === "string") ? customizedLoader.import(entry) : Promise.resolve(entry),
                    customizedLoader.import(renderHandler)
                ])
                    .then(function serverEntry([
                        // First response is a hash of project options
                        serverOptions,

                        // Second response is the handoff to the server
                        server
                    ]) {
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

                if (displayBlueBoxOfDeath) {
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
    }

    return function* render() {
        const {
            cookies,
            request,
            response
        } = this;

        response.status = 200;
        response.type = "text/html";

        const data = yield pageHandler(request, cookies);
        const {
            reply
        } = data;

        this.status = reply.status;

        if (reply.redirect === true) {
            const {
                redirectLocation
            } = reply;
            return this.redirect(`${redirectLocation.pathname}${redirectLocation.search}`);
        }

        if (reply.error) {
            return this.body = reply.error;
        }

        return this.body = reply.html;
    };
};
