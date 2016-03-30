#!/usr/bin/env node

const cp = require("child_process");
const path = require("path");
const program = require("commander");

const Logger = require(path.resolve(__dirname, "../src/utils/logger"));
const logger = new Logger("👀");

const pkg = require(path.resolve(__dirname, "../package.json"));
const childProcesses = [];

function killAllChildProcesses(signal) {
    childProcesses.forEach(childProcess => childProcess.kill(signal));
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

    process.on("exit", () =>process.emit("SIGINT"));
    process.on("SIGINT", () => killAllChildProcesses("SIGINT"));

    process.on("uncaughtException", logger.error.bind(logger));
}
