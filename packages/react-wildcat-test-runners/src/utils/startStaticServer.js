const chalk = require("chalk");
const yawn = require("./yawn.js");
const {argv} = require("yargs");
const {testEnv} = require("./envFlags.js");

const SERVER_AVAILABLE_STRING = "Static server is running";

/**
 * Starts a local server in production mode
 * @return {Promise}        Returns a promise
 */
module.exports = async function startStaticServer() {
    console.info(chalk.grey("No static server found. Starting one now."));

    return yawn(`${testEnv} wildcat-static-server`, {
        resolveWhenLineIncludes: SERVER_AVAILABLE_STRING,
        printStdout: argv.verbose
    });
};
