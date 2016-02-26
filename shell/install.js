/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
var path = require("path");

ls("packages/*").forEach((loc) => {
    const name = path.basename(loc);
    const pkgPath = path.join(cwd, loc, "package.json");

    if (!fs.existsSync(pkgPath)) {
        return;
    }

    const pkg = require(pkgPath);

    cd(loc);
    exec(`npm link`);

    if (name !== "react-wildcat" && name !== "react-wildcat-test-runners") {
        console.log(`jspm link npm:${name}@${pkg.version} --log warn -y`);
        exec(`jspm link npm:${name}@${pkg.version} --log warn -y`);
    }

    cd(cwd);
});
