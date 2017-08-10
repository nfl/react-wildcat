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

program.version(pkg.version).parse(process.argv);

const args = program.args.concat(path.resolve(__dirname, "../main"));
const server = cp.spawn("node", args, {
    stdio: "inherit"
});

childProcesses.push(server);

process.on("exit", () => process.emit("SIGINT"));
process.on("SIGINT", () => killAllChildProcesses("SIGINT"));

process.on("uncaughtException", logger.error.bind(logger));
