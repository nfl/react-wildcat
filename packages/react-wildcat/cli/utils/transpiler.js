"use strict";

const fs = require("fs-extra");
const cwd = process.cwd();
const pkg = require("../../package.json");
const path = require("path");
const resolve = require("resolve");
const notifier = require("node-notifier");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");

const Logger = require("../../src/utils/logger");
const logger = new Logger("🔰");

const transpile = require("../../src/utils/transpile");

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

let babelOptions = {};
const babelRcPath = path.join(cwd, ".babelrc");

if (pathExists.sync(babelRcPath)) {
    babelOptions = JSON.parse(fs.readFileSync(babelRcPath));
}

module.exports = function transpiler(commander) {
    const wildcatConfig = require("../../src/utils/getWildcatConfig")(cwd);
    const generalSettings = wildcatConfig.generalSettings;
    const serverSettings = wildcatConfig.serverSettings;
    const coverageSettings = generalSettings.coverageSettings;
    const coverage = generalSettings.coverage;

    return function (src, relative, done) {
        // remove extension and then append back on .js
        relative = relative.replace(/\.(\w*?)$/, "") + ".js";

        const outDir = commander.outDir || serverSettings.outDir;
        const sourceDir = commander.sourceDir || serverSettings.sourceDir;

        const relativePath = path.join(outDir, relative);
        const modulePath = pathResolve(cwd, relativePath);
        const moduleSourcePath = pathResolve(cwd, relativePath.replace(outDir, sourceDir));

        const pathOptions = {
            modulePath,
            moduleSourcePath,
            relativePath
        };

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: moduleSourcePath,
            sourceMapTarget: path.basename(moduleSourcePath)
        });

        return new Promise((transpileResolve, transpileReject) => {
            return transpile({
                babel,

                coverage,
                coverageSettings,

                babelOptions,
                dataOptions,
                pathOptions,

                logger,
                logLevel: 0
            }, transpileResolve, transpileReject);
        })
            .then(() => done && done())
            .catch(err => {
                // Desktop notification
                notifier.notify({
                    icon: path.resolve(__dirname, "./logo/nfl-engineering-light.png"),
                    title: `${logger.id} ${err.name} in ${pkg.name}`,
                    message: err.message,
                    sound: "Sosumi"
                });

                done && done(err);
            });
    };
};
