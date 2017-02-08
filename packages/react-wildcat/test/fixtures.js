const cwd = process.cwd();
const path = require("path");
const chalk = require("chalk");

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

const publicDir = serverSettings.publicDir;
exports.publicDir = publicDir;

const sourceDir = serverSettings.sourceDir;
exports.sourceDir = sourceDir;

function getPublicPath(source) {
    return source
        .replace(sourceDir, publicDir);
}
exports.getPublicPath = getPublicPath;

const exampleDir = path.join(cwd, "example");
exports.exampleDir = exampleDir;

const devConfigFile = path.join(exampleDir, "config/webpack/development.client.config.js");
exports.devConfigFile = devConfigFile;

const prodConfigFile = path.join(exampleDir, "config/webpack/production.config.js");
exports.prodConfigFile = prodConfigFile;

const getEnvironment = ({
    BABEL_ENV = undefined,
    DEBUG = undefined,
    NODE_ENV = undefined
} = {}) => ({
    generalSettings: {
        env: {
            __DEV__: NODE_ENV === "development",
            __PROD__: NODE_ENV === "production",
            __TEST__: BABEL_ENV === "test",
            BABEL_ENV,
            DEBUG,
            NODE_ENV
        }
    }
});
exports.getEnvironment = getEnvironment;

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

const errorArrayStub = [
    {
        message: `SyntaxError: "foo" is read-only`,
        id: 92
    }
];
exports.errorArrayStub = errorArrayStub;

const failedRequest = {
    host: "www.example.com",
    url: "/failed-request"
};
exports.failedRequest = failedRequest;

const origin = generalSettings.staticUrl;
exports.origin = origin;

const logLevel = 4;
exports.logLevel = logLevel;

const coverage = undefined;
exports.coverage = coverage;

const coverageSettings = generalSettings.coverageSettings;
exports.coverageSettings = coverageSettings;

const waitForFileWrite = false;
exports.waitForFileWrite = waitForFileWrite;

const writeDelay = 200;
exports.writeDelay = writeDelay;

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
