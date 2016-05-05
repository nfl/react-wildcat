import fs from "fs";
import path from "path";
import open from "open";
import glob from "glob";
import istanbul from "istanbul";
import configuration from "istanbul/lib/config";

const cwd = process.cwd();

/**
 * Starts a local server in production mode
 * @return {Promise}        Returns a promise
 */
export default async function writeCoverageResults(coverageEnvSettings) {
    return new Promise((resolve, reject) => {
        const reporterConfig = configuration.loadFile(null, coverageEnvSettings);

        const reportingSettings = coverageEnvSettings.reporting;
        const reportDir = reportingSettings.dir;

        const reporter = new istanbul.Reporter(reporterConfig);
        const collector = new istanbul.Collector();

        reporter.addAll(reportingSettings.reports);

        glob(path.join(cwd, `${reportDir}/*.json`), (globErr, files) => {
            if (globErr) {
                return reject(globErr);
            }

            files.forEach(jsonFile => {
                const instrumentation = require(jsonFile);
                collector.add(instrumentation);
            });

            reporter.write(collector, true, reporterErr => {
                if (reporterErr) {
                    return reject(reporterErr);
                }

                const indexFile = path.join(cwd, `${reportDir}/index.html`);

                if (fs.existsSync(indexFile)) {
                    open(indexFile);
                }

                return resolve();
            });

            return undefined;
        });
    });
}
