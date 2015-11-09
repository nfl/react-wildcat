import url from "url";
import path from "path";
import yawn from "./utils/yawn.js";
import checkServerStatus from "./utils/checkServerStatus.js";
import startLocalServer from "./utils/startLocalServer.js";
import startStaticServer from "./utils/startStaticServer.js";

const cwd = process.cwd();

var wildcatConfig = require(path.join(cwd, "wildcat.config.js"));

var serverSettings = wildcatConfig.serverSettings;
var appServerSettings = serverSettings.appServer;
var staticServerSettings = serverSettings.staticServer;

var originUrl = url.format({
    protocol: appServerSettings.protocol.replace("http2", "https"),
    hostname: appServerSettings.hostname,
    port: appServerSettings.port
});

var staticUrl = url.format({
    protocol: staticServerSettings.protocol.replace("http2", "https"),
    hostname: staticServerSettings.hostname,
    port: staticServerSettings.port
});

const args = process.argv.slice(2).join(` `).trim();

/* eslint-disable no-process-exit */
export default async () => {
    try {
        const origin = originUrl;
        const shouldStartLocalServer = await checkServerStatus(origin);

        const staticOrigin = staticUrl;
        const shouldStartStaticServer = await checkServerStatus(staticOrigin);

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
                startStaticServer()
            ];
        }

        if (promises.length) {
            await Promise.all(promises);
        }

        await yawn(`npm run webdriver-update`);
        await yawn(`protractor protractor.config.js ${args}`);

        process.exit();
    } catch (e) {
        process.exit(e);
    }
}();
