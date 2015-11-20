module.exports = function renderReactWithJSPM(root, options) {
    "use strict";

    const jspm = require("jspm");
    const __PROD__ = (process.env.NODE_ENV === "production");

    const cache = options.cache;
    const wildcatConfig = options.wildcatConfig;

    function customizeJSPMLoader() {
        const generalSettings = wildcatConfig.generalSettings;

        const loader = jspm.Loader({
            baseURL: generalSettings.staticUrl
        });

        // Load remote config
        return loader.import(generalSettings.jspmConfigFile)
            .then(() => {
                // FIXME: Possibly not needed in jspm 0.17
                // store the old normalization function
                const systemNormalize = loader.normalize;

                // override the normalization function
                function customNormalize(name, parentName, parentAddress) {
                    return systemNormalize.call(this, name, parentName, parentAddress).then(function (url) {
                        if ((/\.(?:eot|gif|jpe?g|json|otf|png|svg|ttf|woff)\.js$/).test(url)) {
                            return url.replace(/\.js$/, "");
                        }

                        return url;
                    });
                }

                loader.config({
                    normalize: customNormalize
                });

                return loader;
            });
    }

    function pageHandler(request, cookies) {
        jspm.setPackagePath(root);

        // Set up jspm to use our custom fetch implementation
        return customizeJSPMLoader(wildcatConfig)
            .then(loader => {
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
                    .then(responses => {
                        // First response is a hash of project options
                        const serverOptions = responses[0];

                        // Second response is the handoff to the server
                        const server = responses[1];

                        // Pass options to server
                        return server(serverOptions);
                    })
                    .then(render => render(request, cookies, wildcatConfig))
                    .then(reply => {
                        // Find all packages not found in predefinedPackages. This is our dependency cache
                        const difference = Object.keys(loader.defined).filter(predefinedPkg => {
                            return predefinedPackages.indexOf(predefinedPkg) === -1;
                        });

                        return {
                            // Return the difference as packageCache
                            packageCache: difference,

                            // Return the original reply
                            reply: reply
                        };
                    })
                    .catch(err => {
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

        const file = cache[request.url] || {};

        response.status = 200;
        response.type = "text/html";
        response.lastModified = file.lastModified || new Date().toGMTString();

        var reply;

        if (request.fresh && file.cache) {
            reply = file.cache;
        } else {
            var data = yield pageHandler(request, cookies);
            reply = data.reply;

            // Save to cache
            cache[request.url] = {
                cache: reply,
                lastModified: response.get("last-modified"),
                packageCache: data.packageCache,
                status: 304
            };
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
