"use strict";

// TODO HACK: Set as global.baseURI so es6-module-loader picks it up.
// TODO HACK: Figure out how to pass this into the module more gracefully

/* istanbul ignore else */
if (!global.baseURI) {
    const wildcatConfig = require("../utils/getWildcatConfig")();
    global.baseURI = wildcatConfig.generalSettings.staticUrl;
}

module.exports = global.baseURI;
