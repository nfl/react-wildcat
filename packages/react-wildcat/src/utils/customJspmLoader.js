"use strict";

const jspm = require("jspm");
const baseURL = require("./baseURI");

let customLoader;
const __PROD__ = (process.env.NODE_ENV === "production");

module.exports = function customJspmLoader(root) {
    if (!customLoader) {
        jspm.setPackagePath(root);

        customLoader = jspm.Loader();
        customLoader.baseURL = baseURL;

        if (!__PROD__) {
            customLoader.trace = true;
        }
    }

    return customLoader;
};
