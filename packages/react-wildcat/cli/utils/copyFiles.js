"use strict";

const pathResolve = require("resolve-path");

module.exports = function copyFiles(commander, wildcatOptions) {
    "use strict";

    const createImportableModule = require("../../src/utils/createImportableModule");

    const root = wildcatOptions.root;
    const origin = wildcatOptions.origin;
    const logger = wildcatOptions.logger;

    const binDir = wildcatOptions.binDir;
    const outDir = wildcatOptions.outDir;
    const sourceDir = wildcatOptions.sourceDir;

    const binaryToModule = commander.binaryToModule;

    return function (filename, done) {
        "use strict";

        const relativePath = filename.replace(sourceDir, outDir);
        const modulePath = pathResolve(root, relativePath);
        const moduleSourcePath = relativePath.replace(outDir, sourceDir);
        const moduleBinPath = relativePath.replace(outDir, binDir);

        const pathOptions = {
            moduleBinPath,
            modulePath,
            moduleSourcePath,
            relativePath
        };

        return new Promise((resolveImportable, rejectImportable) => {
            createImportableModule({
                origin,

                pathOptions,

                logger,
                logLevel: 0,

                temporaryCache: false,
                binaryToModule,

                root
            }, resolveImportable, rejectImportable);
        })
            .then(() => done && done())
            .catch((err) => done && done(err));
    };
};
