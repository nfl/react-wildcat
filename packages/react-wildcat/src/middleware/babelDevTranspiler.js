const path = require("path");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");

const createTranspiledModule = require("../utils/createTranspiledModule");
const createImportableModule = require("../utils/createImportableModule");

module.exports = function babelDevTranspiler(root, {
    babelOptions,
    binDir,
    coverage,
    coverageSettings,
    extensions,
    logger,
    logLevel,
    origin,
    outDir,
    sourceDir
}) {
    const temporaryCache = new Map();

    function* _babelDevTranspiler(ctx, pathOptions) {
        const {
            modulePath,
            moduleSourcePath
        } = pathOptions;

        if (temporaryCache.has(modulePath)) {
            return temporaryCache.get(modulePath);
        }

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: path.join(root, moduleSourcePath),
            sourceMapTarget: path.basename(moduleSourcePath)
        });

        const transpilerPromise = new Promise(function transpilerPromise(resolve, reject) {
            if (extensions.indexOf(path.extname(moduleSourcePath)) !== -1) {
                return createTranspiledModule({
                    coverage,
                    coverageSettings,

                    babelOptions,
                    dataOptions,
                    pathOptions,

                    logger,
                    logLevel,

                    temporaryCache
                }, resolve, reject);
            }

            return createImportableModule({
                origin,

                pathOptions,

                logger,
                logLevel,

                temporaryCache,
                binaryToModule: true,

                root
            }, resolve, reject);
        });

        // Save the data to a temporary cache, useful to avoid multiple writes to disk
        temporaryCache.set(modulePath, transpilerPromise);
        return transpilerPromise;
    }

    return function* setupTranspiler(next) {
        "use strict";

        const {
            request,
            response: res
        } = this;

        if (!request.path.startsWith(`/${outDir}`)) {
            return yield next;
        }

        const relativePath = request.path.slice(1);
        const modulePath = pathResolve(root, relativePath);

        if (!pathExists.sync(modulePath)) {
            const moduleSourcePath = relativePath.replace(outDir, sourceDir);
            const moduleBinPath = relativePath.replace(outDir, binDir);

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
