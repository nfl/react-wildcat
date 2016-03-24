"use strict";

const fs = require("fs-extra");
const cwd = process.cwd();
const path = require("path");
const resolve = require("resolve");

const Logger = require("../../src/utils/logger");
const logger = new Logger("🔰");

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

module.exports = function handleFile(commander) {
    const wildcatConfig = require("../../src/utils/getWildcatConfig")(cwd);
    const transpiler = require("./transpiler")(commander);

    function log(msg) {
        if (!commander.quiet) {
            logger.meta(msg);
        }
    }

    return function (src, filename, done) {
        if (util.shouldIgnore(src, [])) {
            return done && done();
        }

        const dest = path.join(commander.outDir, filename);

        if (util.canCompile(filename, commander.extensions)) {
            return transpiler(src, filename, (err) => {
                log(src + " -> " + dest);
                return done && done(err);
            });
        } else if (commander.copyFiles) {
            let rawDest;

            if (commander.binaryToModule) {
                rawDest = path.join("bin", filename);

                const origin = `${wildcatConfig.generalSettings.staticUrl || ""}/`;
                const importable = `module.exports = "${origin}${rawDest}";`;

                fs.createOutputStream(dest)
                    .end(importable);
            }

            return fs.createReadStream(src)
                .pipe(
                    fs.createOutputStream(rawDest || dest)
                        .on("finish", function outputStreamFinish() {
                            log(src + " -> " + dest);
                            return done && done();
                        })
                );
        }
    };
};
