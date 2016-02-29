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
const webdriverBin = path.join(cwd, "node_modules/protractor/bin/webdriver-manager");

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

const args = process.argv.slice(2).join(" ").trim();

/* eslint-disable no-process-exit */
export default (async () => {
    try {
        const origin = originUrl;
        const shouldStartLocalServer = await checkServerStatus(origin);

        const staticOrigin = staticUrl;
        const shouldStartStaticServer = await checkServerStatus(staticOrigin);

        const coverage = generalSettings.coverage;
        const e2eSettings = coverageSettings.e2e;

        let promises = [];

        if (shouldStartLocalServer) {
            promises = [
                ...promises,
                startLocalServer()
            ];
        }

        if (shouldStartStaticServer) {
            promises = [
                ...promises,
                startStaticServer({
                    clean: false
                })
            ];
        }

        if (coverage) {
            await cleanDirectory(e2eSettings.reporting.dir);
        }

        if (promises.length) {
            await Promise.all(promises);
        }

        await yawn(`${webdriverBin} update`);
        await yawn(`protractor protractor.config.js ${args}`);

        if (coverage) {
            await writeCoverageResults(e2eSettings);
        }

        process.exit();
    } catch (e) {
        process.exit(e);
    }
})();
