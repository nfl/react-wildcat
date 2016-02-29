#!/usr/bin/env node

const pkg = require("../package.json");
const cp = require("child_process");
const path = require("path");
const program = require("commander");
const Logger = require("../src/utils/logger");
const logger = new Logger("👀");

const childProcesses = [];

function killAllChildProcesses(signal) {
    childProcesses.forEach(function (childProcess) {
        childProcess.kill(signal);
    });
}

program
    .version(pkg.version)
    .option("-p, --purge-cache <file>", "Purge (remove) the depCache in your SystemJS config.")
    .parse(process.argv);

if (program.purgeCache) {
    const purge = require("./utils/purgeCache");
    purge(program.purgeCache);
} else {
    const server = cp.spawn("node", [
        path.resolve(__dirname, "../main")
    ], {
        stdio: "inherit"
    });

    childProcesses.push(server);

    process.on("exit", function () {
        process.emit("SIGINT");
    });

    process.on("SIGINT", function () {
        killAllChildProcesses("SIGINT");
    });

    process.on("uncaughtException", function (e) {
        logger.error(e);
        killAllChildProcesses("SIGINT");
        throw e;
    });
}
