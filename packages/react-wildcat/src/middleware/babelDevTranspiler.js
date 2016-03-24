const path = require("path");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");

const transpile = require("../utils/transpile");
const createImportableModule = require("../utils/createImportableModule");

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

        if (temporaryCache.has(modulePath)) {
            return temporaryCache.get(modulePath);
        }

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: moduleSourcePath,
            sourceMapTarget: path.basename(moduleSourcePath)
        });

        const transpilerPromise = new Promise(function transpilerPromise(resolve, reject) {
            if (extensions.indexOf(path.extname(moduleSourcePath)) !== -1) {
                return transpile({
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
