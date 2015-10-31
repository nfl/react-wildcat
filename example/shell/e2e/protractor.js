import path from "path";
import yawn from "./utils/yawn.js";
import checkServerStatus from "./utils/checkServerStatus.js";
import startLocalServer from "./utils/startLocalServer.js";
import startStaticServer from "./utils/startStaticServer.js";

const cwd = process.cwd();
const wildcatConfig = require(path.join(cwd, "wildcat.config"));
const generalSettings = wildcatConfig.generalSettings;

const args = process.argv.slice(2).join(` `).trim();

/* eslint-disable no-process-exit */
export default async () => {
    try {
        const origin = generalSettings.originUrl;
        const shouldStartLocalServer = await checkServerStatus(origin);

        const staticOrigin = generalSettings.staticUrl;
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
