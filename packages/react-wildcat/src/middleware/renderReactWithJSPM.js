module.exports = function renderReactWithJspm(root, options) {
    "use strict";

    const customLoader = require("../utils/customJspmLoader")(root);
    const __PROD__ = (process.env.NODE_ENV === "production");

    const routeCache = options.cache;
    const wildcatConfig = options.wildcatConfig;

    let isCustomized = false;

    function customizeJspmLoader() {
        if (isCustomized) {
            return Promise.resolve(customLoader);
        }

        const generalSettings = wildcatConfig.generalSettings;

        // Load remote config
        return customLoader.import(generalSettings.jspmConfigFile)
            .then(function jspmConfigImportHandler() {
                // FIXME: Possibly not needed in jspm 0.17
                // store the old normalization function
                const systemNormalize = customLoader.normalize;

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
                const predefinedPackages = Object.keys(loader.defined);

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
                        // Find all packages not found in predefinedPackages. This is our dependency cache
                        const difference = Object.keys(loader.defined).filter(function diff(predefinedPkg) {
                            return predefinedPackages.indexOf(predefinedPkg) === -1;
                        });

                        return {
                            // Return the difference as packageCache
                            packageCache: difference,

                            // Return the original reply
                            reply: reply
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

        const file = routeCache.get(request.url) || {};

        response.status = 200;
        response.type = "text/html";
        response.lastModified = file.lastModified || new Date().toGMTString();

        const isFresh = (request.fresh || !__PROD__);
        var reply;

        if (isFresh && file.cache) {
            reply = file.cache;
        } else {
            const data = yield pageHandler(request, cookies);
            reply = data.reply;

            // Only cache a successful response
            if (reply.status >= 200 && reply.status < 400) {
                // Save to cache
                routeCache.set(request.url, {
                    cache: reply,
                    lastModified: response.get("last-modified"),
                    packageCache: data.packageCache,
                    status: 304
                });
            }
        }

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
