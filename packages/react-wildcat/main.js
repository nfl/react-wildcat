// Better log
require("better-log/install");

require("./src/server").start();

process.on("unhandledRejection", e => {
    throw e;
});
