"use strict";

const jspm = require("jspm");
const baseURL = require("./baseURI");

let customLoader;

module.exports = function customJspmLoader(root, wildcatConfig) {
    if (!customLoader) {
        jspm.setPackagePath(root);

        customLoader = jspm.Loader();
        customLoader.baseURL = baseURL;

        if (wildcatConfig.serverSettings.hotReload) {
            customLoader.trace = true;
        }
    }

    return customLoader;
};
