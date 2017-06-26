const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const dllConfig = require("../../config/webpack/dll.config.js");

const {cacheEnvDir} = require("../../config/webpack/base.config.js");

function main() {
    const {entry: entries, output} = dllConfig;

    const hasBootstrapped = Object.keys(entries).every(entry => {
        const manifestExists = fs.existsSync(
            path.join(cacheEnvDir, `${entry}-manifest.json`)
        );
        const bundleExists = fs.existsSync(
            path.join(output.path, output.filename.replace("[name]", entry))
        );

        return manifestExists && bundleExists;
    });

    if (hasBootstrapped) {
        return;
    }

    webpack(dllConfig).run(err => {
        if (err) {
            throw err;
        }
    });
}

main();
