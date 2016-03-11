"use strict";

const fs = require("fs-extra");
const cp = require("child_process");
const cwd = process.cwd();
const pathExists = require("path-exists");

const glob = require("glob");

const Logger = require("../../src/utils/logger");
const logger = new Logger("👀");

const availableCpus = require("os").cpus().length;
const CHUNK_SIZE = 50;

module.exports = function handle(commander) {
    const write = require("./write")(commander);
    const cpus = commander.cpus ? Math.min(availableCpus, commander.cpus) : availableCpus;

    function transpileFiles(err, files, src) {
        const numFiles = files.length;

        const processes = Math.min(numFiles, cpus);
        const chunkSize = Math.min(Math.ceil(numFiles / processes), CHUNK_SIZE);

        let index = 0;

        // return the next chunk of work for a free worker
        function next() {
            return files.slice(index, index += chunkSize);
        }

        logger.meta(`Transpiling ${numFiles} files using ${processes} workers...`);

        const workers = [];
        const options = {};

        for (let i = 0; i < processes; i++) {
            workers.push(
                cp.fork(require.resolve("./wildcatBabelWorker.js"))
            );
        }

        return workers.forEach(child => {
            child.send({
                commander,
                files: next(),
                options,
                src
            });

            child.on("message", message => {
                switch (message.action) {
                    case "free":
                        const nextFiles = next();

                        if (!nextFiles.length) {
                            child.send({
                                action: "disconnect"
                            });
                        } else {
                            child.send({
                                commander,
                                files: nextFiles,
                                options,
                                src
                            });
                        }
                        break;
                }
            });
        });
    }

    return function (filename) {
        pathExists(filename).then(function existsResult(exists) {
            if (!exists) {
                return;
            }

            fs.stat(filename, function statResult(statErr, stats) {
                if (statErr) {
                    return logger.error(statErr);
                }

                if (stats.isDirectory(filename)) {
                    glob("**", {
                        cwd: filename,
                        nodir: true,
                        ignore: commander.ignore
                    }, (err, files) => transpileFiles(err, files, filename));
                } else {
                    const currentDirectory = filename.replace(`${cwd}/`, "").split("/")[0];
                    write(filename, filename.replace(`${currentDirectory}/`, ""));
                }
            });
        });
    };
};
