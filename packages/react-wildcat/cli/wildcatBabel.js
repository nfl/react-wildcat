#!/usr/bin/env node
"use strict";

const fs = require("fs-extra");
const cwd = process.cwd();
const pkg = require("../package.json");
const path = require("path");
const pathExists = require("path-exists");

const glob = require("glob");
const slash = require("slash");
const commander = require("commander");
const notifier = require("node-notifier");
const chokidar = require("chokidar");
const resolve = require("resolve");
const Batch = require("batch");

const Logger = require("../src/utils/logger");
const logger = new Logger("👀");

const wildcatConfig = require("../src/utils/getWildcatConfig")(cwd);

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

let babelOptions = {};
const babelRcPath = path.join(cwd, ".babelrc");

if (pathExists.sync(babelRcPath)) {
    babelOptions = JSON.parse(fs.readFileSync(babelRcPath));
}

if (commander.extensions) {
    commander.extensions = util.arrayify(commander.extensions);
}

function addSourceMappingUrl(code, loc) {
    return code + "\n//# sourceMappingURL=" + path.basename(loc);
}

function log(msg) {
    if (!commander.quiet) {
        logger.meta(msg);
    }
}

function logError(err) {
    return `${err.name}: ${err.message}\n${err.codeFrame}`;
}

function write(src, relative, done) {
    // remove extension and then append back on .js
    relative = relative.replace(/\.(\w*?)$/, "") + ".js";

    const dest = path.join(commander.outDir, relative);

    const dataOptions = Object.assign({}, babelOptions, {
        sourceFileName: slash(path.relative(dest + "/..", src)),
        sourceMapTarget: path.basename(relative)
    });

    babel.transformFile(src, dataOptions, function transformData(transformErr, data) {
        if (transformErr) {
            logger.error(logError(transformErr));

            // Desktop notification
            notifier.notify({
                icon: path.resolve(__dirname, "./logo/nfl-engineering-light.png"),
                title: `${logger.id} ${transformErr.name} in ${pkg.name}`,
                message: transformErr.message,
                sound: "Sosumi"
            });

            return done && done();
        }

        if (data.ignored) {
            return done && done();
        }

        const sourceMaps = babelOptions.sourceMaps || ((babelOptions.env || {}).development || {}).sourceMaps;

        if (data.map && sourceMaps && sourceMaps !== "inline") {
            const mapLoc = dest + ".map";
            data.code = addSourceMappingUrl(data.code, mapLoc);

            fs.createOutputStream(mapLoc)
                .end(JSON.stringify(data.map));
        }

        fs.createOutputStream(dest)
            .on("finish", function outputStreamFinish() {
                log(src + " -> " + dest);
                return done && done();
            })
            .end(data.code);
    });
}

function handleFile(src, filename, done) {
    if (util.shouldIgnore(src, [])) {
        return done && done();
    }

    if (util.canCompile(filename, commander.extensions)) {
        write(src, filename, done);
    } else if (commander.copyFiles) {
        let rawDest;

        const dest = path.join(commander.outDir, filename);

        if (commander.binaryToModule) {
            rawDest = path.join("bin", filename);

            const origin = `${wildcatConfig.generalSettings.staticUrl || ""}/`;
            const importable = `module.exports = "${origin}${rawDest}";`;

            fs.createOutputStream(dest)
                .end(importable);
        }

        fs.createReadStream(src)
            .pipe(
                fs.createOutputStream(rawDest || dest)
                    .on("finish", function outputStreamFinish() {
                        log(src + " -> " + dest);
                        return done && done();
                    })
            );
    }
}

function handle(filename) {
    pathExists(filename).then(function existsResult(exists) {
        if (!exists) {
            return;
        }

        fs.stat(filename, function statResult(statErr, stats) {
            if (statErr) {
                return logger.error(statErr);
            }

            if (stats.isDirectory(filename)) {
                const currentDirectory = filename;

                const batch = new Batch();
                batch.concurrency(20);

                function batchFile(currentFile) {
                    const src = path.join(currentDirectory, currentFile);
                    batch.push(function batchJob(done) {
                        handleFile(src, currentFile, done);
                    });
                }

                glob("**", {
                    cwd: filename,
                    nodir: true,
                    ignore: commander.ignore
                }, function globResult(err, files) {
                    files.forEach(function individualFile(currentFile) {
                        batchFile(currentFile);
                    });
                    batch.end();
                });
            } else {
                const currentDirectory = filename.replace(`${cwd}/`, "").split("/")[0];
                write(filename, filename.replace(`${currentDirectory}/`, ""));
            }
        });
    });
}

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
