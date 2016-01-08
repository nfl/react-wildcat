import chalk from "chalk";
import yawn from "./yawn.js";
import {testEnv} from "./envFlags.js";

const SERVER_AVAILABLE_STRING = `server is running`;
const args = process.argv.slice(2);

/**
 * Starts a local server in production mode
 * @return {Promise}        Returns a promise
 */
export default async function startStaticServer({clean}) {
    console.info(chalk.grey(`No static server found. Starting one now.`));

    if (clean) {
        await yawn(`${testEnv} npm run clean`);
    }

    return yawn(`${testEnv} wildcat-static-server`, {
        resolveWhenLineIncludes: SERVER_AVAILABLE_STRING,
        printStdout: args.includes("--verbose")
    });
}
