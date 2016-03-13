/* global ls */
require("shelljs/global");

const cp = require("child_process");
const packages = ls("packages/*");

const workers = packages.map(loc => new Promise(resolve => {
    const child = cp.fork(require.resolve("./utils/pretestWorker.js"));

    child.send({loc});

    child.on("message", message => {
        switch (message.action) {
            case "free":
                child.send({
                    action: "disconnect"
                });
                break;
        }
    });

    return child.on("disconnect", () => resolve());
}));

process.on("unhandledRejection", e => {
    throw e;
});

Promise.all(workers);
