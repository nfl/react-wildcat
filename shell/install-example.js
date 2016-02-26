/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
var path = require("path");

const example = "example";

cd(example);

// Install node modules
exec(`npm install`);

// Install jspm packages
exec(`jspm install --log warn -y`);

cd(cwd);

ls("packages/*").forEach((loc) => {
    const name = path.basename(loc);
    const pkgPath = path.join(cwd, loc, "package.json");

    if (!fs.existsSync(pkgPath)) {
        return;
    }

    const pkg = require(pkgPath);

    cd(example);

    // Link package to npm
    exec(`npm link`);

    if (name !== "react-wildcat" && name !== "react-wildcat-test-runners") {
        // Link package to jspm
        console.log(`jspm install --link npm:${name}@${pkg.version} --log warn -y`);
        exec(`jspm install --link npm:${name}@${pkg.version} --log warn -y`);
    }

    cd(cwd);
});
