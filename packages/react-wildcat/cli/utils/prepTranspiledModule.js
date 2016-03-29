"use strict";

const fs = require("fs-extra");
const pkg = require("../../package.json");
const path = require("path");
const notifier = require("node-notifier");
const pathExists = require("path-exists");
const pathResolve = require("resolve-path");

function findBabelOptions(root) {
    "use strict";

    let babelOptions = {};
    const babelRcPath = path.join(root, ".babelrc");

    if (pathExists.sync(babelRcPath)) {
        babelOptions = JSON.parse(fs.readFileSync(babelRcPath));
    }

    return babelOptions;
}

module.exports = function prepTranspiledModule(commander, wildcatOptions) {
    "use strict";

    const createTranspiledModule = require("../../src/utils/createTranspiledModule");

    const babel = wildcatOptions.babel;

    const root = wildcatOptions.root;
    const logger = wildcatOptions.logger;

    const outDir = wildcatOptions.outDir;
    const sourceDir = wildcatOptions.sourceDir;

    const coverage = wildcatOptions.coverage;
    const coverageSettings = wildcatOptions.coverageSettings;

    return function (filename, done) {
        "use strict";

        const relativePath = filename.replace(sourceDir, outDir);
        const modulePath = pathResolve(root, relativePath);
        const moduleSourcePath = filename;

        const pathOptions = {
            modulePath,
            moduleSourcePath,
            relativePath
        };

        const babelOptions = findBabelOptions(root);

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: moduleSourcePath,
            sourceMapTarget: path.basename(moduleSourcePath)
        });

        return new Promise((transpileResolve, transpileReject) => {
            return createTranspiledModule({
                babel,

                coverage,
                coverageSettings,

                babelOptions,
                dataOptions,
                pathOptions,

                logger,
                logLevel: 0,

                waitForFileWrite: true
            }, transpileResolve, transpileReject);
        })
            .then(() => done && done())
            .catch(err => {
                // Desktop notification
                notifier.notify({
                    icon: path.resolve(__dirname, "./logo/nfl-engineering-light.png"),
                    title: `${logger.id} ${err.name} in ${pkg.name}`,
                    message: err.message,
                    sound: "Sosumi"
                });

                done && done(err);
            });
    };
};
