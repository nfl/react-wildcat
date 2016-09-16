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

// function stuff(dir, otherOptions) {
//     console.log("-- %s", dir);
//     if (otherOptions) {
//         otherOptions.forEach(function things(oDir) {
//             console.log("rmdir %s", oDir);
//         });
//     }
// }

program
    .version(pkg.version)
    .parse(process.argv);

console.log(program.args);

const args = program.args.concat(path.resolve(__dirname, "../main"));
console.log(args);

const server = cp.spawn("node", args, {
    stdio: "inherit"
});

childProcesses.push(server);

process.on("exit", () => process.emit("SIGINT"));
process.on("SIGINT", () => killAllChildProcesses("SIGINT"));

process.on("uncaughtException", logger.error.bind(logger));
