const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");
const LOG_LEVEL = Number(process.env.LOG_LEVEL) || 0;

module.exports = function babelDevTranspiler(root, options) {
    "use strict";

    const babelOptions = options.babelOptions;
    const binDir = options.binDir;
    const extensions = options.extensions;
    const logger = options.logger;
    const origin = options.origin;
    const outDir = options.outDir;
    const sourceDir = options.sourceDir;

    /* istanbul ignore next */
    function addSourceMappingUrl(code, loc) {
        return code + "\n//# sourceMappingURL=" + path.basename(loc);
    }

    function* _babelDevTranspiler(modulePath, moduleSourcePath, moduleBinPath) {
        const babel = require("babel-core");

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: moduleSourcePath,
            sourceMapTarget: path.basename(moduleSourcePath)
        });

        const statusCode = chalk.styles.yellow.open + 201 + chalk.styles.yellow.close;
        const relOut = chalk.styles.grey.open + modulePath.replace(`${root}`, "") + chalk.styles.grey.close;
        const prettyLog = `${statusCode} CREATED ${relOut}`;

        return new Promise((resolve, reject) => {
            if (extensions.indexOf(path.extname(moduleSourcePath)) !== -1) {
                babel.transformFile(moduleSourcePath, dataOptions, (transformErr, data) => {
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
                            .on("error", (outputErr) => {
                                /* istanbul ignore next */
                                logger.error(outputErr);
                                /* istanbul ignore next */
                                return reject(outputErr);
                            })
                            .end(JSON.stringify(data.map));
                    }

                    fs.createOutputStream(modulePath)
                        .on("error", (outputErr) => {
                            /* istanbul ignore next */
                            logger.error(outputErr);
                            /* istanbul ignore next */
                            return reject(outputErr);
                        })
                        .on("finish", () => {
                            if (LOG_LEVEL < 1) {
                                logger.meta(prettyLog);
                            }
                            return resolve(modulePath);
                        })
                        .end(data.code);
                });
            } else {
                const importable = `module.exports = "${origin}${moduleBinPath.replace(`${root}`, "")}";`;

                Promise.all([
                    new Promise((resolveImportable, rejectImportable) => {
                        fs.createOutputStream(modulePath)
                            .on("error", (outputErr) => {
                                /* istanbul ignore next */
                                logger.error(outputErr);
                                /* istanbul ignore next */
                                return rejectImportable(outputErr);
                            })
                            .on("finish", () => resolveImportable(modulePath))
                            .end(importable);
                    }),

                    new Promise((resolveBinary, rejectBinary) => {
                        fs.createReadStream(moduleSourcePath)
                            .pipe(
                                fs.createOutputStream(moduleBinPath || modulePath)
                                    .on("error", (outputErr) => {
                                        /* istanbul ignore next */
                                        logger.error(outputErr);
                                        /* istanbul ignore next */
                                        return rejectBinary(outputErr);
                                    })
                                    .on("finish", () => {
                                        if (LOG_LEVEL < 1) {
                                            logger.meta(prettyLog);
                                        }
                                        return resolveBinary(moduleBinPath || modulePath);
                                    })
                            );
                    })
                ])
                    .then(() => resolve(moduleBinPath || modulePath))
                    .catch((err) => reject(err));
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
                yield _babelDevTranspiler(modulePath, moduleSourcePath, moduleBinPath);
            }
        }

        return yield next;
    };
};
