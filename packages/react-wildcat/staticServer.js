"use strict";

// Better log
require("better-log/install");

// Stub for Fetch API support
require("./src/polyfills/fetch");

require("./src/staticServer").start();

process.on("unhandledRejection", e => {
    throw e;
});
