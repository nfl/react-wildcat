import chalk from "chalk";
import yawn from "./yawn.js";
import {argv} from "yargs";
import {testEnv} from "./envFlags.js";

const SERVER_AVAILABLE_STRING = "Static server is running";

/**
 * Starts a local server in production mode
 * @return {Promise}        Returns a promise
 */
export default async function startStaticServer() {
    console.info(chalk.grey("No static server found. Starting one now."));

    return yawn(`${testEnv} wildcat-static-server`, {
        resolveWhenLineIncludes: SERVER_AVAILABLE_STRING,
        printStdout: argv.verbose
    });
}
