"use strict";

const path = require("path");
const resolve = require("resolve");

// Use project babel if found
let projectBabel;

function findBabel(root) {
    if (projectBabel) {
        return projectBabel;
    }

    try {
        const babelPath = resolve.sync("babel-core", {
            basedir: root
        });

        projectBabel = require(babelPath);
    } catch (e) {
        if (!e.message.startsWith("Cannot find module")) {
            throw e;
        }

        projectBabel = require("babel-core");
    }

    return projectBabel;
}

function getLogger(id) {
    const Logger = require(path.resolve(__dirname, "../../src/utils/logger"));
    return new Logger(id || "🔰");
}

module.exports = function handleFile(commander, wildcatOptions) {
    const root = wildcatOptions.root;

    const outDir = wildcatOptions.outDir;
    const sourceDir = wildcatOptions.sourceDir;

    // Worker processes strip functions out of objects
    // So here I'm making sure helper functions are defined. If not, I need to find them again.
    const fullWildcatOptions = Object.assign({}, wildcatOptions, {
        babel: wildcatOptions.babel || findBabel(root),
        logger: wildcatOptions.logger || getLogger()
    });

    const prepTranspiledModule = require("./prepTranspiledModule")(commander, fullWildcatOptions);
    const prepImportableModule = require("./prepImportableModule")(commander, fullWildcatOptions);

    const babel = fullWildcatOptions.babel;
    const util = babel.util;

    const logger = fullWildcatOptions.logger;

    function log(msg) {
        if (!commander.quiet) {
            logger.meta(msg);
        }
    }

    return function (filename, done) {
        const transpiledFilename = filename.replace(sourceDir, outDir);

        if (util.canCompile(filename, commander.extensions)) {
            return prepTranspiledModule(filename, (err) => {
                log(`${filename} -> ${transpiledFilename}`);
                return done && done(err);
            });
        } else if (commander.copyFiles) {
            return prepImportableModule(filename, (err) => {
                log(`${filename} -> ${transpiledFilename}`);
                return done && done(err);
            });
        }

        return done && done();
    };
};
