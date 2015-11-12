"use strict";

// Better log
require("better-log/install");

// Stub for Fetch API support
require("./src/utils/fetch");

// Stub for baseURI
require("./src/utils/baseURI");

require("./src/server").start();
