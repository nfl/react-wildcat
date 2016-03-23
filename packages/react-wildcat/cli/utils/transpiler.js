"use strict";

const fs = require("fs-extra");
const cwd = process.cwd();
const pkg = require("../../package.json");
const path = require("path");
// const slash = require("slash");
const resolve = require("resolve");
const notifier = require("node-notifier");
const minimatch = require("minimatch");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");

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
    // const logLevel = generalSettings.logLevel;

    const coverage = generalSettings.coverage;
    let instrumenter, instrumentationExcludes;

    if (coverage) {
        const coverageEnv = coverageSettings.env;
        const coverageEnvSettings = coverageSettings[coverageEnv] || {};
        const instrumentationSettings = coverageEnvSettings.instrumentation || {};

        instrumentationExcludes = instrumentationSettings.excludes || [];

        const coverageFiles = process.env.COVERAGE_FILES;
        const suite = process.env.COVERAGE_SUITE;

        if (coverageFiles) {
            // Istanbul only supports excluding files,
            // so the value of files must be converted to a negated exclusion
            // i.e. --cover-files=foo.js,bar.js -> !{foo.js,bar.js}
            const excludedFiles = [
                coverageFiles.includes(",") ? `!{${coverageFiles.trim()}}` : `!${coverageFiles.trim()}`
            ];

            instrumentationExcludes = excludedFiles;
        } else if (suite && instrumentationSettings.onSuiteExcludeCoverage) {
            instrumentationExcludes = instrumentationExcludes.concat(
                instrumentationSettings.onSuiteExcludeCoverage(suite)
            );
        }

        const Istanbul = require("istanbul");
        instrumenter = new Istanbul.Instrumenter(instrumentationSettings);
    }

    function logError(err) {
        return `${err.name}: ${err.message}\n${err.codeFrame}`;
    }

    function addSourceMappingUrl(code, loc) {
        return code + "\n//# sourceMappingURL=" + path.basename(loc);
    }

    return function (src, relative, done) {
        // remove extension and then append back on .js
        relative = relative.replace(/\.(\w*?)$/, "") + ".js";

        const outDir = commander.outDir || serverSettings.outDir;
        const sourceDir = commander.sourceDir || serverSettings.sourceDir;

        const relativePath = path.join(outDir, relative);
        const modulePath = pathResolve(cwd, relativePath);
        const moduleSourcePath = pathResolve(cwd, relativePath.replace(outDir, sourceDir));
        // const moduleBinPath = pathResolve(root, relativePath.replace(outDir, binDir));

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: moduleSourcePath,
            sourceMapTarget: path.basename(moduleSourcePath)
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

                return done && done(transformErr);
            }

            if (data.ignored) {
                return done && done();
            }

            const sourceMaps = babelOptions.sourceMaps || ((babelOptions.env || {}).development || {}).sourceMaps;

            if (data.map && sourceMaps && sourceMaps !== "inline") {
                const mapLoc = modulePath + ".map";
                data.code = addSourceMappingUrl(data.code, mapLoc);

                fs.createOutputStream(mapLoc)
                    .on("error", function outputStreamError(outputErr) {
                        logger.error(outputErr);
                    })
                    .end(JSON.stringify(data.map));
            }

            let instrumentedCodePromise;

            if (
                coverage &&
                instrumenter &&
                !instrumentationExcludes.some(minimatch.bind(null, relativePath))
            ) {
                instrumentedCodePromise = new Promise(
                    function instrumenterPromise(resolveInstrumenter, rejectInstrumenter) {
                        instrumenter.instrument(
                            data.code,
                            relativePath,
                            function instrumentOutput(instrumentError, instrumentedCode) {
                                if (instrumentError) {
                                    return rejectInstrumenter(instrumentError);
                                }

                                return resolveInstrumenter(instrumentedCode);
                            }
                        );
                    }
                );
            } else {
                instrumentedCodePromise = Promise.resolve(data.code);
            }

            instrumentedCodePromise
                .then(function instrumentedCodeResult(code) {
                    fs.createOutputStream(modulePath)
                        .on("error", function outputStreamError(outputErr) {
                            logger.error(outputErr);
                        })
                        .end(code);

                    return done && done();
                })
                .catch(function instrumentedCodeError(err) {
                    logger.error(err);
                    return done && done(err);
                });

            // fs.createOutputStream(dest)
            //     .on("finish", function outputStreamFinish() {
            //         log(src + " -> " + dest);
            //         return done && done();
            //     })
            //     .end(data.code);
        });
    };
};
