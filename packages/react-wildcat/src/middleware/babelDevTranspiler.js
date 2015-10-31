const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");
const LOG_LEVEL = Number(process.env.LOG_LEVEL) || 0;

module.exports = function (root, options) {
    "use strict";

    const babelOptions = options.babelOptions;
    const binDir = options.binDir;
    const extensions = options.extensions;
    const logger = options.logger;
    const origin = options.origin;
    const outDir = options.outDir;
    const sourceDir = options.sourceDir;

    function addSourceMappingUrl(code, loc) {
        return code + "\n//# sourceMappingURL=" + path.basename(loc);
    }

    function* babelDevTranspiler(modulePath, moduleSourcePath, moduleBinPath) {
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
                    if (transformErr) {
                        logger.error(transformErr);
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
                            .end(JSON.stringify(data.map));
                    }

                    fs.createOutputStream(modulePath)
                        .on("finish", () => {
                            if (LOG_LEVEL < 1) {
                                logger.meta(prettyLog);
                            }
                            return resolve();
                        })
                        .end(data.code);
                });
            } else {
                const importable = `module.exports = "${origin}${moduleBinPath.replace(`${root}`, "")}";`;

                fs.createOutputStream(modulePath)
                    .end(importable);

                fs.createReadStream(moduleSourcePath)
                    .pipe(
                        fs.createOutputStream(moduleBinPath || modulePath)
                            .on("finish", () => {
                                if (LOG_LEVEL < 1) {
                                    logger.meta(prettyLog);
                                }
                                return resolve();
                            })
                    );
            }
        });
    }

    return function* (next) {
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
                yield babelDevTranspiler(modulePath, moduleSourcePath, moduleBinPath);
            }
        }

        return yield next;
    };
};
