/* global cd, exec, ls */
require("shelljs/global");

const fs = require("fs");
const cwd = process.cwd();
const path = require("path");

const REACT_VERSION = fs.readFileSync(path.join(cwd, "REACT_VERSION"), "utf8").trim();
const REACT_PACKAGES = [
    "react-addons-test-utils",
    "react",
    "react-dom"
];

function upgradeReactNpm(pkg) {
    const pkgDependencies = (pkg.dependencies || {});
    const pkgDevDependencies = (pkg.devDependencies || {});
    const pkgOptionalDependencies = (pkg.optionalDependencies || {});

    REACT_PACKAGES.forEach(reactPkg => {
        const NPM_REACT_VERSION = `${reactPkg}@${REACT_VERSION}`;

        if (pkgDependencies[reactPkg] && pkgDependencies[reactPkg] !== REACT_VERSION) {
            console.log();
            console.log(`upgrading dependency ${NPM_REACT_VERSION} in ${pkg.name}`);
            exec(`yarn add --exact "${NPM_REACT_VERSION}"`);
        }

        if (pkgDevDependencies[reactPkg] && pkgDevDependencies[reactPkg] !== REACT_VERSION) {
            console.log();
            console.log(`upgrading dev dependency ${NPM_REACT_VERSION} in ${pkg.name}`);
            exec(`yarn add --dev --exact "${NPM_REACT_VERSION}"`);
        }

        if (pkgOptionalDependencies[reactPkg] && pkgOptionalDependencies[reactPkg] !== REACT_VERSION) {
            console.log();
            console.log(`upgrading optional dependency ${NPM_REACT_VERSION} in ${pkg.name}`);
            exec(`yarn add --optional --exact "${NPM_REACT_VERSION}"`);
        }
    });
}

function upgradeReactJspm(pkg) {
    const jspmPkg = pkg.jspm || {};
    const jspmDependencies = jspmPkg.dependencies || {};
    const jspmDevDependencies = jspmPkg.devDependencies || {};

    REACT_PACKAGES.forEach(reactPkg => {
        const JSPM_REACT_VERSION = `npm:${reactPkg}@${REACT_VERSION}`;

        if (
            (jspmDependencies[reactPkg] && jspmDependencies[reactPkg] !== JSPM_REACT_VERSION) ||
            (jspmDevDependencies[reactPkg] && jspmDevDependencies[reactPkg] !== JSPM_REACT_VERSION)
        ) {
            console.log();
            console.log(`upgrading jspm package ${JSPM_REACT_VERSION} in ${pkg.name}`);
            exec(`jspm install "${JSPM_REACT_VERSION}" --log warn`);
        }
    });

    REACT_PACKAGES.forEach(reactPkg => {
        const JSPM_REACT_VERSION = `npm:${reactPkg}@${REACT_VERSION}`;

        if (jspmDependencies[reactPkg] || jspmDevDependencies[reactPkg]) {
            console.log();
            console.log(`resolving jspm package ${JSPM_REACT_VERSION} in ${pkg.name}`);
            exec(`jspm resolve --only "${JSPM_REACT_VERSION}"`);
            exec(`jspm clean`);
        }
    });
}

ls("packages")
    .map(pkg => path.join("packages", pkg))
    .concat([
        cwd,
        "example"
    ])
    .forEach((loc) => {
        const pkgPath = path.resolve(cwd, path.join(loc, "package.json"));
        const systemConfigPath = path.resolve(cwd, path.join(loc, "system.config.js"));

        const isNpmPackage = fs.existsSync(pkgPath);
        const isJspmPackage = fs.existsSync(systemConfigPath);

        if (!isNpmPackage && !isJspmPackage) {
            return;
        }

        cd(loc);

        if (isNpmPackage) {
            upgradeReactNpm(require(pkgPath));
        }

        if (isJspmPackage) {
            upgradeReactJspm(require(pkgPath));
        }

        cd(cwd);
    });
