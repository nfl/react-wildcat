"use strict";

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
    "use strict";

    const wildcatConfig = require("../../src/utils/getWildcatConfig")(cwd);
    const transpiler = require("./transpiler")(commander);
    const copyFiles = require("./copyFiles")(commander);

    function log(msg) {
        if (!commander.quiet) {
            logger.meta(msg);
        }
    }

    return function (src, filename, done) {
        if (util.shouldIgnore(src, [])) {
            return done && done();
        }

        const serverSettings = wildcatConfig.serverSettings;
        const outDir = commander.outDir || serverSettings.publicDir;
        const relativePath = path.join(outDir, filename);

        if (util.canCompile(filename, commander.extensions)) {
            return transpiler(src, filename, (err) => {
                log(src + " -> " + relativePath);
                return done && done(err);
            });
        } else if (commander.copyFiles) {
            return copyFiles(src, filename, (err) => {
                log(src + " -> " + relativePath);
                return done && done(err);
            });
        }
    };
};
