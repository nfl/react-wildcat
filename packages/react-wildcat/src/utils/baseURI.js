"use strict";

// TODO HACK: Set as global.baseURI so es6-module-loader picks it up.
// TODO HACK: Figure out how to pass this into the module more gracefully
if (!global.baseURI) {
    const cwd = process.cwd();
    const path = require("path");
    const wildcatConfig = require(path.join(cwd, "wildcat.config"));

    global.baseURI = wildcatConfig.generalSettings.staticUrl;
}
