"use strict";

const jspm = require("jspm");
const baseURL = require("./baseURI");

let customLoader;

module.exports = function customJspmLoader(root) {
    if (!customLoader) {
        jspm.setPackagePath(root);

        customLoader = jspm.Loader({
            baseURL
        });
    }

    return customLoader;
};
