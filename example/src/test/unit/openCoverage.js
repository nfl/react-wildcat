const open = require("open");

const DEFAULT_JEST_COVERAGE_DIRECTORY = "coverage";
const jestCoverageDirectory =
    process.env.npm_package_jest_coverageDirectory ||
    DEFAULT_JEST_COVERAGE_DIRECTORY;

open(`./${jestCoverageDirectory}/index.html`);
