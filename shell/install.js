/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
const path = require("path");

ls("packages").forEach((loc) => {
    const name = path.basename(loc);
    const pkgDir = path.join(cwd, "packages", loc);
    const pkgPath = path.join(pkgDir, "package.json");

    if (!fs.existsSync(pkgPath)) {
        return;
    }

    const pkg = require(pkgPath);

    cd(pkgDir);
    exec(`npm link`);

    if (name !== "react-wildcat" && name !== "react-wildcat-test-runners") {
        console.log(`jspm link npm:${name}@${pkg.version} --log ok -y`);
        exec(`jspm link npm:${name}@${pkg.version} --log ok -y`);
    }

    cd(cwd);
});
