#!/usr/bin/env node

const cp = require("child_process");
const path = require("path");
const program = require("commander");
const Logger = require("../src/utils/logger");
const logger = new Logger("☁️");

const pkg = require(path.resolve(__dirname, "../package.json"));
const childProcesses = [];

function killAllChildProcesses(signal) {
    childProcesses.forEach(function (childProcess) {
        childProcess.kill(signal);
    });
}

program
    .version(pkg.version)
    .parse(process.argv);

const server = cp.spawn("node", [
    path.resolve(__dirname, "../staticServer")
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

process.on("uncaughtException", logger.error.bind(logger));
