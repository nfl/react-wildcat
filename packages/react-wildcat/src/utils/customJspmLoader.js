"use strict";

const jspm = require("jspm");
const baseURL = require("./baseURI");

let customLoader;

module.exports = function customJspmLoader(root) {
    jspm.setPackagePath(root);

    customLoader = customLoader || jspm.Loader({
        baseURL
    });

    return customLoader;
};
