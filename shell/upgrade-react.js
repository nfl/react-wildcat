/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
const path = require("path");

const REACT_VERSION = fs
    .readFileSync(path.join(cwd, "REACT_VERSION"), "utf8")
    .trim();
const REACT_PACKAGES = ["react-addons-test-utils", "react", "react-dom"];

function upgradeReactNpm(pkg) {
    const pkgDependencies = pkg.dependencies || {};
    const pkgDevDependencies = pkg.devDependencies || {};
    const pkgOptionalDependencies = pkg.optionalDependencies || {};

    REACT_PACKAGES.forEach(reactPkg => {
        const NPM_REACT_VERSION = `${reactPkg}@${REACT_VERSION}`;

        if (
            pkgDependencies[reactPkg] &&
            pkgDependencies[reactPkg] !== REACT_VERSION
        ) {
            console.log();
            console.log(
                `upgrading dependency ${NPM_REACT_VERSION} in ${pkg.name}`
            );
            exec(`yarn add --exact "${NPM_REACT_VERSION}"`);
        }

        if (
            pkgDevDependencies[reactPkg] &&
            pkgDevDependencies[reactPkg] !== REACT_VERSION
        ) {
            console.log();
            console.log(
                `upgrading dev dependency ${NPM_REACT_VERSION} in ${pkg.name}`
            );
            exec(`yarn add --dev --exact "${NPM_REACT_VERSION}"`);
        }

        if (
            pkgOptionalDependencies[reactPkg] &&
            pkgOptionalDependencies[reactPkg] !== REACT_VERSION
        ) {
            console.log();
            console.log(
                `upgrading optional dependency ${NPM_REACT_VERSION} in ${pkg.name}`
            );
            exec(`yarn add --optional --exact "${NPM_REACT_VERSION}"`);
        }
    });
}

ls("packages")
    .map(pkg => path.join("packages", pkg))
    .concat([cwd, "example"])
    .forEach(loc => {
        const pkgPath = path.resolve(cwd, path.join(loc, "package.json"));

        const isNpmPackage = fs.existsSync(pkgPath);

        if (!isNpmPackage) {
            return;
        }

        cd(loc);

        if (isNpmPackage) {
            upgradeReactNpm(require(pkgPath));
        }

        cd(cwd);
    });
