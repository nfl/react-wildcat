module.exports = function renderReactWithJspm(root, options) {
    "use strict";

    const customLoader = require("../utils/customJspmLoader")(root);
    const __PROD__ = (process.env.NODE_ENV === "production");

    const wildcatConfig = options.wildcatConfig;

    let isCustomized = false;

    function customizeJspmLoader() {
        if (isCustomized) {
            return Promise.resolve(customLoader);
        }

        const generalSettings = wildcatConfig.generalSettings;

        // store the old normalization function
        const systemNormalize = customLoader.normalize;

        // Load remote config
        return customLoader.import(generalSettings.jspmConfigFile)
            .then(function jspmConfigImportHandler() {
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
                            const modulePath = err.message.split(" ").pop();

                            if (modulePath && modulePath.startsWith("http")) {
                                const failedModules = customLoader.failed
                                    .filter(function filterFailedModules(failure) {
                                        return failure.dependencies.some(dep => dep.value === modulePath);
                                    })
                                    .map(function remapFailedModules(failedModule) {
                                        return failedModule.name;
                                    });

                                failedModules.forEach(function withFailedModule(failedModule) {
                                    // SystemJS doesn't register failures as defined modules
                                    // so we have to manually remove them
                                    if (customLoader._loader.moduleRecords[failedModule]) {
                                        delete customLoader._loader.moduleRecords[failedModule];
                                    }

                                    if (customLoader.defined[failedModule]) {
                                        delete customLoader.defined[failedModule];
                                    }
                                });
                            }

                            return {
                                reply: {
                                    error: blueBoxOfDeath(err, request),
                                    status: 500
                                }
                            };
                        }

                        return {
                            reply: {
                                error: err.message,
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
