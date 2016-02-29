import url from "url";
import path from "path";
import glob from "glob";
import open from "open";
import yawn from "./utils/yawn.js";
import cleanDirectory from "./utils/cleanDirectory.js";
import checkServerStatus from "./utils/checkServerStatus.js";
import startFileWatcher from "./utils/startFileWatcher.js";
import startStaticServer from "./utils/startStaticServer.js";

const cwd = process.cwd();

const wildcatConfig = require(path.join(cwd, "wildcat.config.js"));

const generalSettings = wildcatConfig.generalSettings;
const coverageSettings = generalSettings.coverageSettings;
const serverSettings = wildcatConfig.serverSettings;
const staticServerSettings = serverSettings.staticServer;

const staticUrl = url.format({
    protocol: staticServerSettings.protocol.replace("http2", "https"),
    hostname: staticServerSettings.hostname,
    port: staticServerSettings.port
});

const args = process.argv.slice(2).join(" ").trim();

/* eslint-disable no-process-exit */
export default (async () => {
    try {
        const staticOrigin = staticUrl;
        const shouldStartStaticServer = await checkServerStatus(staticOrigin);

        const coverage = generalSettings.coverage;
        const unitReportDir = coverageSettings.unit.reporting.dir;

        let promises = [
            startFileWatcher()
        ];

        if (shouldStartStaticServer) {
            promises = [
                ...promises,
                startStaticServer({
                    clean: false
                })
            ];
        }

        if (coverage) {
            await cleanDirectory(unitReportDir);
        }

        if (promises.length) {
            await Promise.all(promises);
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
