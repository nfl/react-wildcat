import chalk from "chalk";
import yawn from "./yawn.js";
import {argv} from "yargs";
import {testEnv} from "./envFlags.js";

const SERVER_AVAILABLE_STRING = "server is running";

/**
 * Starts a local server in production mode
 * @return {Promise}        Returns a promise
 */
export default async function startLocalServer() {
    console.info(chalk.grey("No server found. Starting one now."));

    return yawn(`${testEnv} wildcat`, {
        resolveWhenLineIncludes: SERVER_AVAILABLE_STRING,
        printStdout: argv.verbose
    });
}
