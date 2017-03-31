import path from "path";
import glob from "glob";
import open from "open";
import yawn from "./utils/yawn.js";
import cleanDirectory from "./utils/cleanDirectory.js";

const cwd = process.cwd();

const wildcatConfig = require(path.join(cwd, "wildcat.config.js"));

const generalSettings = wildcatConfig.generalSettings;
const coverageSettings = generalSettings.coverageSettings;

const args = process.argv.slice(2).join(" ").trim();

/* eslint-disable no-process-exit */
export default (async () => {
    try {
        const coverage = generalSettings.coverage;
        const unitReportDir = coverageSettings.unit.reporting.dir;

        if (coverage) {
            await cleanDirectory(unitReportDir);
        }

        await yawn(`karma start karma.config.js ${args}`);

        if (coverage) {
            glob.sync(`${unitReportDir}/*/index.html`).forEach(pathname => open(pathname));
        }

        process.exit();
    } catch (e) {
        process.exit(e);
    }
})();
