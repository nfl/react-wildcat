/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
const path = require("path");

ls("packages").forEach((loc) => {
    const pkgDir = path.join(cwd, "packages", loc);
    const pkgPath = path.join(pkgDir, "package.json");

    if (!fs.existsSync(pkgPath)) {
        return;
    }

    cd(pkgDir);

    if (pkgDir === "react-wildcat-handoff") {
        exec(`yarn run build`);
    }

    exec(`yarn install`);
    exec(`yarn link --force`);

    cd(cwd);
});
