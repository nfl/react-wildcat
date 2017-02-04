"use strict";

const path = require("path");
const replace = require("replace");
const swPrecache = require("sw-precache");
const wildcatConfig = require("../wildcat.config.js");

const swDirectory = `${__dirname}/../static`;
const staticServer = wildcatConfig.serverSettings.staticServer;
const usePort = staticServer.hostname.indexOf("localhost") !== -1;
const appServer = wildcatConfig.serverSettings.appServer;

let staticHost = `https://${staticServer.hostname}`;
if (usePort) {
    staticHost = `${staticHost}:${staticServer.port}`;
}

const staticHostRegex = new RegExp(staticHost);

let appHost = `https://${appServer.hostname}`;
if (usePort) {
    appHost = `${appHost}:${appServer.port}`;
}

const appHostRegex = new RegExp(appHost);


const serviceWorkerPath = path.join(swDirectory, "service-worker.js");

swPrecache.write(serviceWorkerPath, {
    cacheId: wildcatConfig.generalSettings.name,
    staticFileGlobs: [
        "bundles/*.js",
        "public/**/*"
    ],
    runtimeCaching: [{
        urlPattern: /\/$/,
        handler: "fastest"
    }, {
        urlPattern: new RegExp(`^${staticHostRegex.source}`),
        handler: "cacheFirst"
    }, {
        urlPattern: new RegExp(`^${appHostRegex.source}`),
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
