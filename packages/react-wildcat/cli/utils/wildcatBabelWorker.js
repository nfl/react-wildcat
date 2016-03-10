"use strict";

const path = require("path");
const Batch = require("batch");
const batch = new Batch();

batch.concurrency(20);

const finish = () => process.disconnect();

const run = (message) => {
    const handleFile = require("./handleFile")(message.commander);

    const files = message.files;
    const currentDirectory = message.src;

    function batchFile(currentFile) {
        const src = path.join(currentDirectory, currentFile);

        batch.push(function batchJob(done) {
            handleFile(src, currentFile, done);
        });
    }

    files.forEach(function individualFile(currentFile) {
        batchFile(currentFile);
    });

    batch.end(() => process.send({
        action: "free"
    }));
};

process.on("message", message => {
    switch (message.action) {
        case "disconnect":
            return finish();

        default:
            return run(message);
    }
});
