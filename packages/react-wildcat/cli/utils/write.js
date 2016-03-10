"use strict";

const fs = require("fs-extra");
const cwd = process.cwd();
const pkg = require("../../package.json");
const path = require("path");
const slash = require("slash");
const resolve = require("resolve");
const notifier = require("node-notifier");
const pathExists = require("path-exists");

const Logger = require("../../src/utils/logger");
const logger = new Logger("👀");

// Use project babel if found
let babel;

try {
    const babelPath = resolve.sync("babel", {
        basedir: cwd
    });

    babel = require(babelPath);
} catch (e) {
    if (e.message.indexOf("Cannot find module") === -1) {
        throw e;
    }

    babel = require("babel");
}

let babelOptions = {};
const babelRcPath = path.join(cwd, ".babelrc");

if (pathExists.sync(babelRcPath)) {
    babelOptions = JSON.parse(fs.readFileSync(babelRcPath));
}

module.exports = function write(commander) {
    function log(msg) {
        if (!commander.quiet) {
            logger.meta(msg);
        }
    }

    function logError(err) {
        return `${err.name}: ${err.message}\n${err.codeFrame}`;
    }

    function addSourceMappingUrl(code, loc) {
        return code + "\n//# sourceMappingURL=" + path.basename(loc);
    }

    return function (src, relative, done) {
        // remove extension and then append back on .js
        relative = relative.replace(/\.(\w*?)$/, "") + ".js";

        const dest = path.join(commander.outDir, relative);

        const dataOptions = Object.assign({}, babelOptions, {
            sourceFileName: slash(path.relative(dest + "/..", src)),
            sourceMapTarget: path.basename(relative)
        });

        babel.transformFile(src, dataOptions, function transformData(transformErr, data) {
            if (transformErr) {
                logger.error(logError(transformErr));

                // Desktop notification
                notifier.notify({
                    icon: path.resolve(__dirname, "./logo/nfl-engineering-light.png"),
                    title: `${logger.id} ${transformErr.name} in ${pkg.name}`,
                    message: transformErr.message,
                    sound: "Sosumi"
                });

                return done && done();
            }

            if (data.ignored) {
                return done && done();
            }

            const sourceMaps = babelOptions.sourceMaps || ((babelOptions.env || {}).development || {}).sourceMaps;

            if (data.map && sourceMaps && sourceMaps !== "inline") {
                const mapLoc = dest + ".map";
                data.code = addSourceMappingUrl(data.code, mapLoc);

                fs.createOutputStream(mapLoc)
                    .end(JSON.stringify(data.map));
            }

            fs.createOutputStream(dest)
                .on("finish", function outputStreamFinish() {
                    log(src + " -> " + dest);
                    return done && done();
                })
                .end(data.code);
        });
    };
};
