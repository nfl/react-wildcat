"use strict";

// Better log
require("better-log/install");

// Stub for Fetch API support
require("./src/utils/fetch");

require("./src/staticServer").start();
