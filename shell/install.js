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

    exec(`yarn install`);
    exec(`yarn link --force`);

    if (pkgDir.endsWith("react-wildcat-handoff")) {
        // Fix a bug where Webpack does not dedupe node_modules in linked packages
        exec(`rm -fr node_modules/react-helmet`);
        exec(`ln -sfv ../../example/node_modules/react-helmet ./node_modules/react-helmet`);
    }

    cd(cwd);
});
