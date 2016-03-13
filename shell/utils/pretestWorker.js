"use strict";

/* global cd, exec */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
const path = require("path");

const finish = () => process.disconnect();

const run = (message) => {
    const loc = message.loc;
    const pkgPath = path.join(cwd, loc, "package.json");

    if (!fs.existsSync(pkgPath)) {
        return;
    }

    const pkg = require(pkgPath);

    if (pkg.scripts) {
        cd(loc);

        if (pkg.scripts.pretest) {
            exec(`npm run pretest --silent`);
        }

        if (pkg.scripts.posttest) {
            exec(`npm run posttest --silent`);
        }

        cd(cwd);
    }

    return process.send({
        action: "free"
    });
};

process.on("message", message => {
    switch (message.action) {
        case "disconnect":
            return finish();

        default:
            return run(message);
    }
});
