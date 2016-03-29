const fs = require("fs-extra");
const path = require("path");
const minimatch = require("minimatch");

const logCreateSuccess = require("./logCreateSuccess");
const logTransformError = require("./logTransformError");

function addSourceMappingUrl(code, loc) {
    "use strict";
    return code + "\n//# sourceMappingURL=" + path.basename(loc);
}

module.exports = function transpile(options, resolve, reject) {
    "use strict";

    const babel = options.babel || require("babel-core");

    const logger = options.logger;
    const logLevel = options.logLevel;

    const babelOptions = options.babelOptions;
    const dataOptions = options.dataOptions;
    const pathOptions = options.pathOptions;

    const modulePath = pathOptions.modulePath;
    const moduleSourcePath = pathOptions.moduleSourcePath;
    const relativePath = pathOptions.relativePath;

    const temporaryCache = options.temporaryCache;

    const coverage = options.coverage;
    const coverageSettings = options.coverageSettings;

    const waitForFileWrite = options.waitForFileWrite;

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
        } else if (suite && typeof instrumentationSettings.onSuiteExcludeCoverage === "function") {
            instrumentationExcludes = instrumentationExcludes.concat(
                instrumentationSettings.onSuiteExcludeCoverage(suite)
            );
        }

        const Istanbul = require("istanbul");
        instrumenter = new Istanbul.Instrumenter(instrumentationSettings);
    }

    babel.transformFile(moduleSourcePath, dataOptions, function transformFile(transformErr, data) {
        if (transformErr) {
            logger.error(logTransformError(transformErr));
            return reject(transformErr);
        }

        if (data.ignored) {
            return resolve();
        }

        const sourceMaps = babelOptions.sourceMaps || ((babelOptions.env || {}).development || {}).sourceMaps;

        if (data.map && sourceMaps && sourceMaps !== "inline") {
            const mapLoc = modulePath + ".map";
            data.code = addSourceMappingUrl(data.code, mapLoc);

            fs.createOutputStream(mapLoc)
                .on("open", function outputStreamOpen() {
                    if (logLevel > 1) {
                        logger.meta(logCreateSuccess(modulePath));
                    }
                })
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
                const res = {
                    type: "application/x-es-module",
                    length: code.length,
                    body: code,
                    status: 200
                };

                fs.createOutputStream(modulePath)
                    .on("open", function outputStreamOpen() {
                        if (logLevel > 1) {
                            logger.meta(logCreateSuccess(modulePath));
                        }
                    })
                    .on("error", function outputStreamError(outputErr) {
                        if (temporaryCache) {
                            // Disk write error, delete the temporary cache
                            temporaryCache.delete(modulePath);
                        }

                        logger.error(outputErr);
                    })
                    .on("finish", function outputStreamFinish() {
                        if (temporaryCache) {
                            // Disk write complete, delete the temporary cache
                            temporaryCache.delete(modulePath);
                        }

                        if (waitForFileWrite) {
                            return resolve(res);
                        }
                    })
                    .end(code);

                if (temporaryCache) {
                    // Code is available before disk write, update the temporary cache
                    temporaryCache.set(modulePath, Promise.resolve(res));
                }

                if (!waitForFileWrite) {
                    return resolve(res);
                }
            })
            .catch(function instrumentedCodeError(err) {
                if (temporaryCache) {
                    // Disk write error, delete the temporary cache
                    temporaryCache.delete(modulePath);
                }

                logger.error(err);
                return reject(err);
            });
    });
};
