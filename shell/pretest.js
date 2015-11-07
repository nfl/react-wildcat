/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
var path = require("path");

ls("packages/*").forEach((loc) => {
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
});

