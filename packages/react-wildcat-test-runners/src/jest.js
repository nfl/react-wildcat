import url from "url";
import path from "path";
import yawn from "./utils/yawn.js";
import cleanDirectory from "./utils/cleanDirectory.js";
import checkServerStatus from "./utils/checkServerStatus.js";
import startLocalServer from "./utils/startLocalServer.js";
import startStaticServer from "./utils/startStaticServer.js";
import writeCoverageResults from "./utils/writeCoverageResults.js";

const cwd = process.cwd();

const wildcatConfig = require(path.join(cwd, "wildcat.config.js"));

const generalSettings = wildcatConfig.generalSettings;
const coverageSettings = generalSettings.coverageSettings;
const serverSettings = wildcatConfig.serverSettings;
const appServerSettings = serverSettings.appServer;
const staticServerSettings = serverSettings.staticServer;

const originUrl = url.format({
    protocol: appServerSettings.protocol.replace("http2", "https"),
    hostname: appServerSettings.hostname,
    port: appServerSettings.port
});

const staticUrl = url.format({
    protocol: staticServerSettings.protocol.replace("http2", "https"),
    hostname: staticServerSettings.hostname,
    port: staticServerSettings.port
});

const args = process.argv.join(" ").trim();

/* eslint-disable no-process-exit */
export default (async () => {
    try {
        const coverage = generalSettings.coverage;
        const e2eSettings = coverageSettings.e2e;

        const promises = [
            checkServerStatus(originUrl).then(
                value => (value ? startLocalServer() : null)
            ),
            checkServerStatus(staticUrl).then(
                value => (value ? startStaticServer() : null)
            )
        ];

        if (coverage) {
            promises.push(cleanDirectory(e2eSettings.reporting.dir));
        }

        await Promise.all(promises);
        await yawn(`jest ${args}`);
        if (coverage) {
            await writeCoverageResults(e2eSettings);
        }

        process.exit();
    } catch (e) {
        process.exit(e);
    }
})();
