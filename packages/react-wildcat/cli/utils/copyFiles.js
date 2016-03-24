"use strict";

const cwd = process.cwd();
const path = require("path");
const pathResolve = require("resolve-path");

const Logger = require("../../src/utils/logger");
const logger = new Logger("🔰");

module.exports = function copyFiles(commander) {
    "use strict";

    const createImportableModule = require("../../src/utils/createImportableModule");
    const wildcatConfig = require("../../src/utils/getWildcatConfig")(cwd);

    const serverSettings = wildcatConfig.serverSettings;
    const outDir = commander.outDir || serverSettings.publicDir;

    const binaryToModule = commander.binaryToModule;

    const binDir = commander.binDir || serverSettings.binDir;
    let sourceDir = commander.args[0] || serverSettings.sourceDir;

    if (path.extname(sourceDir)) {
        sourceDir = path.dirname(sourceDir);
    }

    return function (src, filename, done) {
        const relativePath = path.join(outDir, filename);
        const modulePath = pathResolve(cwd, relativePath);
        const moduleSourcePath = pathResolve(cwd, relativePath.replace(outDir, sourceDir));
        const moduleBinPath = pathResolve(cwd, relativePath.replace(outDir, binDir));

        const pathOptions = {
            moduleBinPath,
            modulePath,
            moduleSourcePath,
            relativePath
        };

        const origin = `${wildcatConfig.generalSettings.staticUrl || ""}/`;

        return new Promise((resolveImportable, rejectImportable) => {
            createImportableModule({
                origin,

                pathOptions,

                logger,
                logLevel: 0,

                temporaryCache: false,
                binaryToModule
            }, resolveImportable, rejectImportable);
        })
            .then(() => done && done())
            .catch((err) => done && done(err));
    };
};
