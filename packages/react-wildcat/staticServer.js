// Better log
require("better-log/install");

require("./src/staticServer").start();

process.on("unhandledRejection", e => {
    throw e;
});
