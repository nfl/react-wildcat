"use strict";

const jspm = require("jspm");
const cwd = process.cwd();

const __PROD__ = (process.env.NODE_ENV === "production");

function customizeJSPMLoader(wildcatConfig) {
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

function pageHandler(request, cookies, wildcatConfig) {
    jspm.setPackagePath(cwd);

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
                loader.import(entry),
                loader.import(renderHandler)
            ])
                .then(promises => {
                    // First promise is a hash of project options
                    const options = promises[0];

                    // Second promise is the handoff to the server
                    const server = promises[1];

                    // Pass options to server
                    return server(options);
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
                        const blueBoxOfDeath = require("./blueBoxOfDeath");

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

module.exports = pageHandler;
