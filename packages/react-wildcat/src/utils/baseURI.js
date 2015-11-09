"use strict";

// TODO HACK: Set as global.baseURI so es6-module-loader picks it up.
// TODO HACK: Figure out how to pass this into the module more gracefully
if (!global.baseURI) {
    const wildcatConfig = require("./getWildcatConfig")();
    global.baseURI = wildcatConfig.generalSettings.staticUrl;
}
