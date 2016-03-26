"use strict";

const cwd = process.cwd();
const path = require("path");
const resolve = require("resolve");

const Logger = require("../../src/utils/logger");
exports.Logger = Logger;

const logger = new Logger("🔰");
exports.logger = logger;

function LoggerStub() {
    return logger;
}
exports.LoggerStub = LoggerStub;

const wildcatConfig = require("../../src/utils/getWildcatConfig")(cwd);
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

function findBabel(root) {
    "use strict";

    // Use project babel if found
    let babel;

    try {
        const babelPath = resolve.sync("babel", {
            basedir: root
        });

        babel = require(babelPath);
    } catch (e) {
        if (e.message.indexOf("Cannot find module") === -1) {
            throw e;
        }

        babel = require("babel");
    }

    return babel;
}
exports.findBabel = findBabel;

function CommanderStub(options) {
    "use strict";

    Object.keys(options).forEach(k => this[k] = options[k]);

    this.version = () => this;
    this.option = () => this;
    this.parse = () => this;

    return this;
}
exports.CommanderStub = CommanderStub;

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

const errorStub = new Error("test error");
exports.errorStub = errorStub;

const manifestTestFile = "manifest.txt";
exports.manifestTestFile = manifestTestFile;

const failureTestFile = "src/failureTest.js";
exports.failureTestFile = failureTestFile;

const exampleDir = path.join(cwd, "example");
exports.exampleDir = exampleDir;

const mainEntrySourcePath = `${sourceDir}/main.js`;
exports.mainEntrySourcePath = mainEntrySourcePath;

const mainEntryTranspiledPath = path.join(exampleDir, getPublicPath(mainEntrySourcePath));
exports.mainEntryTranspiledPath = mainEntryTranspiledPath;

const exampleBinarySourcePath = `${sourceDir}/assets/images/primary-background.jpg`;
exports.exampleBinarySourcePath = exampleBinarySourcePath;

const exampleBinaryPath = `/${publicDir}/assets/images/primary-background.jpg`;
exports.exampleBinaryPath = exampleBinaryPath;

const writeDelay = 200;
exports.writeDelay = writeDelay;

const wildcatOptions = {
    babel: findBabel(exampleDir),

    root: exampleDir,
    origin: generalSettings.staticUrl,
    logger,

    coverage: undefined,
    coverageSettings: generalSettings.coverageSettings,

    binDir,
    outDir: publicDir,
    sourceDir
};
exports.wildcatOptions = wildcatOptions;

const commanderDefaults = {
    args: [
        mainEntrySourcePath
    ],

    extensions: [
        ".es6",
        ".js",
        ".es",
        ".jsx"
    ],

    watch: undefined,
    outDir: publicDir,
    ignore: undefined,
    copyFiles: true,
    binaryToModule: true,
    manifest: undefined,
    cpus: undefined,
    quiet: true
};
exports.commanderDefaults = commanderDefaults;
