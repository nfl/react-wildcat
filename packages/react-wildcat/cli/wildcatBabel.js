#!/usr/bin/env node
"use strict";

const fs = require("fs-extra");
const cwd = process.cwd();
const pkg = require("../package.json");
const path = require("path");

const glob = require("glob");
const commander = require("commander");
const chokidar = require("chokidar");
const resolve = require("resolve");

const Logger = require("../src/utils/logger");
const logger = new Logger("👀");

function patterns(val) {
    return val.split(" ");
}

commander
    .version(pkg.version)
    .option("-x, --extensions [extensions]", "List of extensions to compile when a directory has been input [.es6,.js,.es,.jsx]")
    .option("-w, --watch", "Recompile files on changes")
    .option("-d, --out-dir [out]", "Compile an input directory of modules into an output directory")
    .option("-i, --ignore <patterns>", "RegExp pattern to ignore", patterns)
    .option("-D, --copy-files", "When compiling a directory copy over non-compilable files")
    .option("-B, --binary-to-module", "Convert non-compilable files to importable modules")
    .option("-M, --manifest [path]", "Use a manifest to specify files to compile.")
    .option("-q, --quiet", "Don't log anything")
    .parse(process.argv);

const srcPath = commander.args[0];
const dirname = path.join(cwd, srcPath);

// Use project babel if found
let babel;

try {
    const babelPath = resolve.sync("babel", {
        basedir: cwd
    });

    babel = require(babelPath);
} catch (e) {
    if (e.message.indexOf("Cannot find module") === -1) {
        throw e;
    }

    babel = require("babel");
}

const util = babel.util;

if (commander.extensions) {
    commander.extensions = util.arrayify(commander.extensions);
}

const handleFile = require("./utils/handleFile")(commander);
const handle = require("./utils/handle")(commander);

if (!commander.watch) {
    let filenames;

    if (commander.manifest) {
        filenames = fs.readFileSync(commander.manifest, "utf8").trim().split("\n");
    } else {
        filenames = commander.args.reduce(function fileReducer(globbed, input) {
            let files = glob.sync(input, {
                ignore: commander.ignore
            });
            if (!files.length) {
                files = [input];
            }
            return globbed.concat(files);
        }, []);

        filenames = filenames.filter(function fileReducerFilter(element, idx) {
            return filenames.indexOf(element) === idx;
        });
    }

    filenames.forEach(handle);
}

if (commander.watch) {
    const watcher = chokidar.watch(srcPath, {
        ignoreInitial: true,
        persistent: true
    });

    ["add", "change"].forEach(function watchEventType(type) {
        watcher.on(type, function watchEventHandler(filename) {
            const relative = path.relative(dirname, filename) || filename;

            try {
                handleFile(filename, relative);
            } catch (err) {
                logger.error(err.stack);
            }
        });
    });

    logger.ok("Watching local files for code changes");
}
