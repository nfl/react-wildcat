#!/usr/bin/env node

const path = require("path");
var sep = (process.platform === "win32") ? ";" : ":";

// Make protractor aware of module imports relative to src
var nodeModulesPath = process.env.NODE_PATH || "";
var srcPath = path.join(process.cwd(), "src");

process.env.NODE_PATH = [nodeModulesPath, srcPath].join(sep);

require("../lib/protractor.js");
