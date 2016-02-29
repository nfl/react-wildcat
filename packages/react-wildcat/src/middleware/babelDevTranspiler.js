const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const minimatch = require("minimatch");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");

module.exports = function babelDevTranspiler(root, options) {
    "use strict";

    const babelOptions = options.babelOptions;
    const binDir = options.binDir;
    const coverage = options.coverage;
    const coverageSettings = options.coverageSettings;
    const extensions = options.extensions;
    const logger = options.logger;
    const logLevel = options.logLevel;
    const origin = options.origin;
    const outDir = options.outDir;
    const sourceDir = options.sourceDir;

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

    /* istanbul ignore next */
    function addSourceMappingUrl(code, loc) {
        return code + "\n//# sourceMappingURL=" + path.basename(loc);
    }

    function* _babelDevTranspiler(ctx, pathOptions) {
        const babel = require("babel-core");
        const res = ctx.response;

        const modulePath = pathOptions.modulePath;
        const moduleSourcePath = pathOptions.moduleSourcePath;
        const moduleBinPath = pathOptions.moduleBinPath;
        const relativePath = pathOptions.relativePath;

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: moduleSourcePath,
            sourceMapTarget: path.basename(moduleSourcePath)
        });

        const statusCode = chalk.styles.yellow.open + 201 + chalk.styles.yellow.close;
        const relOut = chalk.styles.grey.open + modulePath.replace(`${root}`, "") + chalk.styles.grey.close;
        const prettyLog = `${statusCode} CREATE ${relOut}`;

        return new Promise(function transpilerPromise(resolve, reject) {
            if (extensions.indexOf(path.extname(moduleSourcePath)) !== -1) {
                babel.transformFile(moduleSourcePath, dataOptions, function transformFile(transformErr, data) {
                    /* istanbul ignore next */
                    if (transformErr) {
                        logger.error(transformErr);
                        return reject(transformErr);
                    }

                    /* istanbul ignore next */
                    if (data.ignored) {
                        return resolve();
                    }

                    /* istanbul ignore next */
                    const sourceMaps = babelOptions.sourceMaps || ((babelOptions.env || {}).development || {}).sourceMaps;

                    /* istanbul ignore next */
                    if (data.map && sourceMaps && sourceMaps !== "inline") {
                        const mapLoc = modulePath + ".map";
                        data.code = addSourceMappingUrl(data.code, mapLoc);

                        fs.createOutputStream(mapLoc)
                            .on("error", function outputStreamError(outputErr) {
                                /* istanbul ignore next */
                                logger.error(outputErr);
                                /* istanbul ignore next */
                                return reject(outputErr);
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
                            res.type = "application/x-es-module";
                            res.length = code.length;
                            res.body = code;
                            res.status = 200;

                            if (logLevel > 1) {
                                logger.meta(prettyLog);
                            }

                            fs.createOutputStream(modulePath)
                                .on("error", function outputStreamError(outputErr) {
                                    /* istanbul ignore next */
                                    logger.error(outputErr);
                                })
                                .end(code);

                            return resolve(modulePath);
                        })
                        .catch(function instrumentedCodeError(err) {
                            return reject(err);
                        });
                });
            } else {
                const importable = `module.exports = "${origin}${moduleBinPath.replace(`${root}`, "")}";`;

                Promise.all([
                    new Promise(function importablePromise(resolveImportable) {
                        res.type = "application/x-es-module";
                        res.length = importable.length;
                        res.body = importable;
                        res.status = 200;

                        fs.createOutputStream(modulePath)
                            .on("error", function importableStreamError(outputErr) {
                                /* istanbul ignore next */
                                logger.error(outputErr);
                            })
                            .end(importable);

                        return resolveImportable(modulePath);
                    }),

                    new Promise(function binaryPromise(resolveBinary, rejectBinary) {
                        fs.createReadStream(moduleSourcePath)
                            .pipe(
                                fs.createOutputStream(moduleBinPath || modulePath)
                                    .on("error", function binaryStreamError(outputErr) {
                                        /* istanbul ignore next */
                                        logger.error(outputErr);
                                        /* istanbul ignore next */
                                        return rejectBinary(outputErr);
                                    })
                                    .on("finish", function binaryStreamFinish() {
                                        if (logLevel > 1) {
                                            logger.meta(prettyLog);
                                        }
                                        return resolveBinary(moduleBinPath || modulePath);
                                    })
                            );
                    })
                ])
                    .then(function promiseResolve() {
                        return resolve(moduleBinPath || modulePath);
                    })
                    .catch(function promiseError(err) {
                        return reject(err);
                    });
            }
        });
    }

    return function* transpile(next) {
        const request = this.request;

        if (!request.url.startsWith(`/${outDir}`)) {
            return yield next;
        }

        const relativePath = request.url.slice(1);
        const modulePath = pathResolve(root, relativePath);

        if (!pathExists.sync(modulePath)) {
            const moduleSourcePath = pathResolve(root, relativePath.replace(outDir, sourceDir));
            const moduleBinPath = pathResolve(root, relativePath.replace(outDir, binDir));

            if (pathExists.sync(moduleSourcePath)) {
                yield _babelDevTranspiler(this, {
                    modulePath: modulePath,
                    moduleSourcePath: moduleSourcePath,
                    moduleBinPath: moduleBinPath,
                    relativePath: relativePath
                });
            }
        }

        return yield next;
    };
};
