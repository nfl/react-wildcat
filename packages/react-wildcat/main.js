"use strict";

// Better log
require("better-log/install");

// Stub for Fetch API support
require("./src/polyfills/fetch");

// Stub for baseURI
require("./src/polyfills/baseURI");

require("./src/server").start();

process.on("unhandledRejection", e => {
    throw e;
});
