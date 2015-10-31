const fs = require("fs-extra");
const cwd = process.cwd();
const path = require("path");
const pathExists = require("path-exists");

module.exports = function (configPath) {
    const absPath = path.join(cwd, configPath);

    if (!pathExists.sync(absPath)) {
        throw new Error(`Path ${absPath} does not exist.`);
    }

    const oldSystem = global.System;

    global.System = {
        config: function (cfg) {
            if (cfg.depCache) {
                delete cfg.depCache;
            }

            fs.createOutputStream(absPath)
                .end(`System.config(${JSON.stringify(cfg, null, 2)});\n`);
        }
    };

    require(absPath);
    global.System = oldSystem;
};
