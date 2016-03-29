"use strict";

const fs = require("fs-extra");
const cwd = process.cwd();
const path = require("path");
const chalk = require("chalk");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");

const Logger = require("../src/utils/logger");
exports.Logger = Logger;

const logger = new Logger("🔰");
exports.logger = logger;

const wildcatConfig = require("../src/utils/getWildcatConfig")(cwd);
exports.wildcatConfig = wildcatConfig;

const generalSettings = wildcatConfig.generalSettings;
exports.generalSettings = generalSettings;

const serverSettings = wildcatConfig.serverSettings;
exports.serverSettings = serverSettings;

const binDir = serverSettings.binDir;
exports.binDir = binDir;

const publicDir = serverSettings.publicDir;
exports.publicDir = publicDir;

const sourceDir = serverSettings.sourceDir;
exports.sourceDir = sourceDir;

function getBinPath(source) {
    "use strict";

    return source
        .replace(publicDir, binDir)
        .replace(sourceDir, binDir);
}
exports.getBinPath = getBinPath;

function getPublicPath(source) {
    "use strict";

    return source
        .replace(binDir, publicDir)
        .replace(sourceDir, publicDir);
}
exports.getPublicPath = getPublicPath;

const exampleDir = path.join(cwd, "example");
exports.exampleDir = exampleDir;

const projectConfigFile = path.join(exampleDir, "wildcat.config.js");
exports.projectConfigFile = projectConfigFile;

const mainEntrySourcePath = `${sourceDir}/main.js`;
exports.mainEntrySourcePath = mainEntrySourcePath;

const mainEntryTranspiledPath = getPublicPath(mainEntrySourcePath);
exports.mainEntryTranspiledPath = mainEntryTranspiledPath;

const mainEntryAbsTranspiledPath = path.join(exampleDir, mainEntryTranspiledPath);
exports.mainEntryAbsTranspiledPath = mainEntryAbsTranspiledPath;

const customEmoji = "🏈";
exports.customEmoji = customEmoji;

const NullConsoleLogger = (() => {
    function NullLogger() {}

    NullLogger.prototype = {
        info: () => {},
        meta: () => {},
        ok: () => {},
        warn: () => {},
        error: () => {}
    };

    return NullLogger;
})();
exports.NullConsoleLogger = NullConsoleLogger;

const logMethods = {
    "error": "error",
    "info": "info",
    "log": "log",
    "meta": "log",
    "ok": "log",
    "warn": "warn"
};
exports.logMethods = logMethods;

const logColors = {
    "error": "red",
    "info": "magenta",
    "log": null,
    "meta": "gray",
    "ok": "green",
    "warn": "yellow"
};
exports.logColors = logColors;

const mapLogMethods = {
    "error": "error",
    "info": "info",
    "log": "info",
    "meta": "info",
    "ok": "info",
    "warn": "error"
};
exports.mapLogMethods = mapLogMethods;

const errorStub = new Error("test error");
exports.errorStub = errorStub;

const failedRequest = {
    host: "www.example.com",
    url: "/failed-request"
};
exports.failedRequest = failedRequest;

const origin = generalSettings.staticUrl;
exports.origin = origin;

const logLevel = 4;
exports.logLevel = logLevel;

const exampleBinarySourcePath = `${sourceDir}/assets/images/primary-background.jpg`;
exports.exampleBinarySourcePath = exampleBinarySourcePath;

const exampleBinaryPath = `/${publicDir}/assets/images/primary-background.jpg`;
exports.exampleBinaryPath = exampleBinaryPath;

let babelOptions = {};

const babelRcPath = path.join(exampleDir, ".babelrc");
exports.babelRcPath = babelRcPath;

if (pathExists.sync(babelRcPath)) {
    babelOptions = JSON.parse(fs.readFileSync(babelRcPath));
}
exports.babelOptions = babelOptions;

function getPathOptions(sourcePath) {
    const relativePath = getPublicPath(sourcePath);
    const modulePath = pathResolve(exampleDir, relativePath);
    const moduleSourcePath = relativePath.replace(publicDir, sourceDir);
    const moduleBinPath = relativePath.replace(publicDir, binDir);

    return {
        modulePath,
        moduleSourcePath,
        moduleBinPath,
        relativePath
    };
}

function getDataOptions(sourcePath) {
    const dataOptions = Object.assign({}, babelOptions, {
        sourceFileName: sourcePath,
        sourceMapTarget: path.basename(sourcePath)
    });

    return dataOptions;
}

const temporaryCache = new Map();
exports.temporaryCache = temporaryCache;

const binaryToModule = true;
exports.binaryToModule = binaryToModule;

const importBinaryDefaults = {
    root: exampleDir,
    origin,

    logger,
    logLevel,

    pathOptions: getPathOptions(exampleBinarySourcePath),

    temporaryCache,
    binaryToModule
};
exports.importBinaryDefaults = importBinaryDefaults;

const coverage = undefined;
exports.coverage = coverage;

const coverageSettings = generalSettings.coverageSettings;
exports.coverageSettings = coverageSettings;

const waitForFileWrite = false;
exports.waitForFileWrite = waitForFileWrite;

const transpileModuleDefaults = {
    babel: require("babel-core"),

    logger,
    logLevel,

    babelOptions,
    dataOptions: getDataOptions(mainEntrySourcePath),
    pathOptions: getPathOptions(mainEntrySourcePath),

    temporaryCache,

    coverage,
    coverageSettings,

    waitForFileWrite
};
exports.transpileModuleDefaults = transpileModuleDefaults;

const writeDelay = 200;
exports.writeDelay = writeDelay;

const jspmPackage = "react";
exports.jspmPackage = jspmPackage;

const temporaryPackageJSON = path.join(exampleDir, "tmp.json");
exports.temporaryPackageJSON = temporaryPackageJSON;

function addColor(arg, method) {
    const color = logColors[method];

    if (typeof arg !== "string" || !color) {
        return arg;
    }

    return chalk.styles[color].open + arg + chalk.styles[color].close;
}
exports.addColor = addColor;

const failureTestFile = "src/failureTest.js";
exports.failureTestFile = failureTestFile;
