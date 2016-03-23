const fs = require("fs-extra");
const path = require("path");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");

const logCreateSuccess = require("../utils/logCreateSuccess");
const transpile = require("../utils/transpile");

module.exports = function babelDevTranspiler(root, options) {
    "use strict";

    const temporaryCache = new Map();

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

    function* _babelDevTranspiler(ctx, pathOptions) {
        "use strict";

        const modulePath = pathOptions.modulePath;
        const moduleSourcePath = pathOptions.moduleSourcePath;
        const moduleBinPath = pathOptions.moduleBinPath;

        if (temporaryCache.has(modulePath)) {
            return temporaryCache.get(modulePath);
        }

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: moduleSourcePath,
            sourceMapTarget: path.basename(moduleSourcePath)
        });

        const transpilerPromise = new Promise(function transpilerPromise(resolve, reject) {
            if (extensions.indexOf(path.extname(moduleSourcePath)) !== -1) {
                transpile({
                    coverage,
                    coverageSettings,

                    babelOptions,
                    dataOptions,
                    pathOptions,

                    logger,
                    logLevel,

                    temporaryCache
                }, resolve, reject);
            } else {
                const importable = `module.exports = "${origin}${moduleBinPath.replace(`${root}`, "")}";`;

                Promise.all([
                    new Promise(function importablePromise(resolveImportable, rejectImportable) {
                        const res = {
                            type: "application/x-es-module",
                            length: importable.length,
                            body: importable,
                            status: 200
                        };

                        fs.createOutputStream(modulePath)
                            .on("error", function importableStreamError(outputErr) {
                                logger.error(outputErr);
                                return rejectImportable(outputErr);
                            })
                            .on("finish", function importableStreamFinish() {
                                return resolveImportable(res);
                            })
                            .end(importable);
                    }),

                    new Promise(function binaryPromise(resolveBinary, rejectBinary) {
                        fs.createReadStream(moduleSourcePath)
                            .pipe(
                                fs.createOutputStream(moduleBinPath || modulePath)
                                    .on("open", function binaryStreamOpen() {
                                        if (logLevel > 1) {
                                            logger.meta(logCreateSuccess(modulePath));
                                        }
                                    })
                                    .on("error", function binaryStreamError(outputErr) {
                                        logger.error(outputErr);
                                        return rejectBinary(outputErr);
                                    })
                                    .on("finish", function binaryStreamFinish() {
                                        return resolveBinary(moduleBinPath || modulePath);
                                    })
                            );
                    })
                ])
                    .then(function promiseResolve(promises) {
                        // Disk write complete, delete the temporary cache
                        temporaryCache.delete(modulePath);
                        return resolve(promises[0]);
                    })
                    .catch(function promiseError(err) {
                        // Disk write error, delete the temporary cache
                        temporaryCache.delete(modulePath);
                        return reject(err);
                    });
            }
        });

        // Save the data to a temporary cache, useful to avoid multiple writes to disk
        temporaryCache.set(modulePath, transpilerPromise);
        return transpilerPromise;
    }

    return function* setupTranspiler(next) {
        "use strict";

        const request = this.request;
        const res = this.response;

        if (!request.url.startsWith(`/${outDir}`)) {
            return yield next;
        }

        const relativePath = request.url.slice(1);
        const modulePath = pathResolve(root, relativePath);

        if (!pathExists.sync(modulePath)) {
            const moduleSourcePath = pathResolve(root, relativePath.replace(outDir, sourceDir));
            const moduleBinPath = pathResolve(root, relativePath.replace(outDir, binDir));

            if (pathExists.sync(moduleSourcePath)) {
                const data = yield _babelDevTranspiler(this, {
                    modulePath,
                    moduleSourcePath,
                    moduleBinPath,
                    relativePath
                });

                Object.assign(res, data);
            }
        }

        return yield next;
    };
};
