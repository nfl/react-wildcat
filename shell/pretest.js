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

    if (pkg.scripts && pkg.scripts.pretest) {
        cd(loc);
        exec(pkg.scripts.pretest);
        cd(cwd);
    }
});

