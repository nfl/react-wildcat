const createReporter = require("istanbul-api").createReporter;
const istanbulCoverage = require("istanbul-lib-coverage");

const map = istanbulCoverage.createCoverageMap();
const reporter = createReporter();

const tests = ["node", "jest-node", "jest-browser"];

tests.forEach(test => {
    const coverage = require(`../coverage/${test}/coverage-final.json`);
    Object.keys(coverage).forEach(filename =>
        map.addFileCoverage(coverage[filename])
    );
});

reporter.addAll(["json", "lcov", "text"]);
reporter.write(map);
