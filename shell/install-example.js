/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
const path = require("path");

const example = "example";

cd(example);

// Install node modules
exec(`yarn install`);

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
