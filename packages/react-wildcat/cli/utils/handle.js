"use strict";

const fs = require("fs-extra");
const cp = require("child_process");
const pathExists = require("path-exists");

const glob = require("glob");

const availableCpus = require("os").cpus().length;
const CHUNK_SIZE = 50;

module.exports = function handle(commander, wildcatOptions) {
    "use strict";

    const logger = wildcatOptions.logger;

    const prepTranspiledModule = require("./prepTranspiledModule")(commander, wildcatOptions);
    const cpus = commander.cpus ? Math.min(availableCpus, commander.cpus) : availableCpus;

    function transpileFiles(err, files) {
        const numFiles = files.length;

        const processes = Math.min(numFiles, cpus);
        const chunkSize = Math.min(Math.ceil(numFiles / processes), CHUNK_SIZE);

        let index = 0;

        // Remove babel reference to pass to the web worker
        const sanitizedWildcatOptions = Object.assign({}, wildcatOptions, {
            babel: false
        });

        // return the next chunk of work for a free worker
        function next() {
            return files.slice(index, index += chunkSize);
        }

        logger.meta(`Transpiling ${numFiles} files using ${processes} worker${processes > 1 ? `s` : ``}...`);

        const workers = [];

        for (let i = 0; i < processes; i++) {
            workers.push(
                cp.fork(require.resolve("./wildcatBabelWorker.js"))
            );
        }

        return Promise.all(workers.map(child => {
            return new Promise((workerResolve, workerReject) => {
                child.send({
                    commander,
                    files: next(),
                    wildcatOptions: sanitizedWildcatOptions
                });

                child.on("message", message => {
                    switch (message.action) {
                        case "free":
                            const nextFiles = next();

                            if (!nextFiles.length) {
                                child.send({
                                    action: "disconnect"
                                });

                                return workerResolve();
                            }

                            child.send({
                                commander,
                                files: nextFiles,
                                wildcatOptions: sanitizedWildcatOptions
                            });
                            break;
                    }

                    return undefined;
                });

                child.on("error", workerReject);
            });
        }));
    }

    return function (filename) {
        return new Promise((handleResolve, handleReject) => {
            return pathExists(filename).then(function existsResult(exists) {
                if (!exists) {
                    const warning = `File does not exist: ${filename}`;

                    logger.warn(warning);
                    return handleResolve(warning);
                }

                fs.stat(filename, function statResult(statErr, stats) {
                    if (statErr) {
                        logger.error(statErr);
                        return handleReject(statErr);
                    }

                    if (stats.isDirectory(filename)) {
                        glob(`${filename}/**`, {
                            nodir: true,
                            ignore: commander.ignore
                        }, (err, files) => {
                            if (err) {
                                return handleReject(err);
                            }

                            return transpileFiles(err, files)
                                .then(handleResolve)
                                .catch(handleReject);
                        });
                    } else {
                        return prepTranspiledModule(
                            filename,
                            (transpilerError) => {
                                if (transpilerError) {
                                    return handleReject(transpilerError);
                                }

                                return handleResolve();
                            }
                        );
                    }

                    return undefined;
                });

                return undefined;
            });
        });
    };
};
