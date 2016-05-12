"use strict";

const Batch = require("batch");
const batch = new Batch();

batch.concurrency(20);

const finish = () => process.disconnect();

const run = (message) => {
    const commander = message.commander;
    const wildcatOptions = message.wildcatOptions;
    const files = message.files;

    const handleFile = require("./handleFile")(commander, wildcatOptions);

    function batchFile(currentFile) {
        batch.push(function batchJob(done) {
            handleFile(currentFile, done);
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
