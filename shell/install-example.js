/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
const path = require("path");

const example = "example";

cd(example);

// Install node modules
exec(`yarn install`);

// Fix a bug where Webpack does not dedupe node_modules in linked packages
exec(`rm -fr ./node_modules/react-helmet`);
exec(`ln -sfv ../../packages/react-wildcat-handoff/node_modules/react-helmet ./node_modules/react-helmet`);

cd(cwd);

ls("packages").forEach((loc) => {
    const pkgDir = path.join(cwd, "packages", loc);
    const pkgPath = path.join(pkgDir, "package.json");

    if (!fs.existsSync(pkgPath)) {
        return;
    }

    const pkg = require(pkgPath);

    cd(example);

    // Link package to npm
    exec(`yarn install`);
    exec(`yarn link --force ${pkg.name}`);

    cd(cwd);
});
