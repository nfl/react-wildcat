const chalk = require("chalk");
const yawn = require("./yawn.js");
const {argv} = require("yargs");
const {testEnv} = require("./envFlags.js");

const SERVER_AVAILABLE_STRING = "Node server is running";

/**
 * Starts a local server in production mode
 * @return {Promise}        Returns a promise
 */
module.exports = async function startLocalServer() {
    console.info(chalk.grey("No server found. Starting one now."));

    return yawn(`${testEnv} wildcat`, {
        resolveWhenLineIncludes: SERVER_AVAILABLE_STRING,
        printStdout: argv.verbose
    });
};
