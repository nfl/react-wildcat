#!/usr/bin/env node
"use strict";

const fs = require("fs-extra");
const cwd = process.cwd();
const path = require("path");

const glob = require("glob");
const commander = require("commander");
const chokidar = require("chokidar");
const resolve = require("resolve");

const Logger = require(path.resolve(__dirname, "../src/utils/logger"));
const logger = new Logger("🔰");

const pkg = require(path.resolve(__dirname, "../package.json"));

/* istanbul ignore next */
function patterns(val) {
    return val.split(" ");
}

commander
    .version(pkg.version)
    .option("-x, --extensions [extensions]", "List of extensions to compile when a directory has been input [.es6,.js,.es,.jsx]")
    .option("-w, --watch", "Recompile files on changes")
    .option("--bin-dir [bin]", "Compile binary files into a binary directory")
    .option("-d, --out-dir [out]", "Compile an input directory of modules into an output directory")
    .option("-s, --source-dir [src]", "Specify the target source directory")
    .option("-i, --ignore <patterns>", "RegExp pattern to ignore", patterns)
    .option("-D, --copy-files", "When compiling a directory copy over non-compilable files")
    .option("-B, --binary-to-module", "Convert non-compilable files to importable modules")
    .option("-M, --manifest [path]", "Use a manifest to specify files to compile")
    .option("--minify", "Minify output with UglifyJS")
    .option("--cpus <cpus>", "Specify the number of CPUs to use for code transpilation")
    .option("-q, --quiet", "Don't log anything")
    .parse(process.argv);

const srcPath = commander.args[0];

// Use project babel if found
let babel;

try {
    const babelPath = resolve.sync("babel-core", {
        basedir: cwd
    });

    babel = require(babelPath);
} catch (e) {
    if (!e.message.startsWith("Cannot find module")) {
        throw e;
    }

    babel = require("babel-core");
}

const util = babel.util;

if (commander.extensions) {
    commander.extensions = util.arrayify(commander.extensions);
}

const wildcatConfig = require("../src/utils/getWildcatConfig")(cwd);

const serverSettings = wildcatConfig.serverSettings;
const generalSettings = wildcatConfig.generalSettings;

const wildcatOptions = {
    babel,

    root: cwd,
    origin: generalSettings.staticUrl,
    logger,

    coverage: generalSettings.coverage,
    coverageSettings: generalSettings.coverageSettings,

    binDir: commander.binDir || serverSettings.binDir,
    outDir: commander.outDir || serverSettings.publicDir,
    sourceDir: commander.sourceDir || serverSettings.sourceDir,

    minify: commander.minify || serverSettings.minifyTranspilerOutput,
    minifySettings: serverSettings.minifySettings
};

const handleFile = require("./utils/handleFile")(commander, wildcatOptions);
const handle = require("./utils/handle")(commander, wildcatOptions);

if (!commander.watch) {
    let filenames;

    if (commander.manifest) {
        filenames = fs.readFileSync(commander.manifest, "utf8").trim().split("\n");
    } else {
        filenames = commander.args.reduce(function fileReducer(globbed, input) {
            const files = glob.sync(input, {
                ignore: commander.ignore
            });

            return globbed.concat(files);
        }, []);

        filenames = filenames.filter(function fileReducerFilter(element, idx) {
            return filenames.indexOf(element) === idx;
        });
    }

    module.exports = Promise.all(
        filenames.map(filename => handle(filename))
    );
}

if (commander.watch) {
    module.exports = new Promise((watcherResolve, watcherReject) => {
        const watcher = chokidar.watch(srcPath, {
            ignoreInitial: true,
            persistent: true
        });

        ["add", "change"].forEach(function watchEventType(type) {
            watcher.on(type, function watchEventHandler(filename) {
                handleFile(filename);
            });
        });

        watcher.on("error", watcherReject);

        watcher.on("ready", () => {
            logger.ok("Watching local files for code changes");
            return watcherResolve(watcher);
        });
    });
}
