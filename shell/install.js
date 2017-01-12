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

    if (pkgDir === "react-wildcat-handoff") {
        exec(`yarn run build`);
    }

    exec(`yarn install`);
    exec(`yarn link --force`);

    if (name !== "react-wildcat" && name !== "react-wildcat-test-runners") {
        console.log(`jspm link npm:${name}@${pkg.version} --log warn -y`);
        exec(`jspm link npm:${name}@${pkg.version} --log warn -y`);
    }

    cd(cwd);
});
