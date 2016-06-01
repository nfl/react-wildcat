"use strict";

const path = require("path");
const replace = require("replace");
const swPrecache = require("sw-precache");
const wildcatConfig = require("../wildcat.config.js");

const swDirectory = `${__dirname}/../static`;
const staticServer = wildcatConfig.serverSettings.staticServer;
const usePort = staticServer.hostname.indexOf("localhost") !== -1;

let staticHost = `https://${staticServer.hostname}`;
if (usePort) {
    staticHost = `${staticHost}:${staticServer.port}`;
    console.log("USE PORT: ", staticHost);
}

const staticHostRegex = new RegExp(staticHost);

const serviceWorkerPath = path.join(swDirectory, "service-worker.js");

swPrecache.write(serviceWorkerPath, {
    cacheId: wildcatConfig.generalSettings.name,
    staticFileGlobs: [
        "bundles/*.js",
        "public/components/**/*",
        "public/routes/**/*",
        "public/*.js",
        "public/assets/styles/*.js",
        "public/assets/images/*.jpg",
        "public/application.config.js",
        "jspm_packages/system.js",
        "system.config.js"
    ],
    runtimeCaching: [{
        urlPattern: /\/$/,
        handler: "fastest"
    }, {
        urlPattern: staticHostRegex,
        handler: "cacheFirst"
    }],
    ignoreUrlParametersMatching: /./
}, () => {
    replace({
        regex: "self.location",
        replacement: `"${staticHost}"`,
        paths: [serviceWorkerPath],
        recursive: false,
        silent: true
    });
});
