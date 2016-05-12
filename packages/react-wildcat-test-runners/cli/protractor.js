#!/usr/bin/env node

const path = require("path");
const sep = (process.platform === "win32") ? ";" : ":";

// Make protractor aware of module imports relative to src
const nodeModulesPath = process.env.NODE_PATH || "";
const srcPath = path.join(process.cwd(), "src");

process.env.NODE_PATH = [nodeModulesPath, srcPath].join(sep);

require("../lib/protractor.js");
