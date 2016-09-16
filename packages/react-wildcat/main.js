"use strict";

function generateHeapDumpAndStats() {
    // 1. Force garbage collection every time this function is called
    try {
        global.gc();
    } catch (e) {
        console.log("You must run program with 'node --expose-gc index.js' or 'npm start'");
        process.exit();
    }

    // 2. Output Heap stats
    var heapUsed = process.memoryUsage().heapUsed;
    console.log("Program is using " + heapUsed + " bytes of Heap.")

    // 3. Get Heap dump
    process.kill(process.pid, "SIGUSR2");
}

function generateStats() {
    var heapUsed = process.memoryUsage().heapUsed;
    console.log("Program is using " + heapUsed + " bytes of Heap.")
}


setInterval(generateStats, 20000); // Do garbage collection and heap dump every 20 seconds

// Better log
require("better-log/install");

// Stub for Fetch API support
require("./src/polyfills/fetch");

// Stub for baseURI
require("./src/polyfills/baseURI");

require("./src/server").start();

process.on("unhandledRejection", e => {
    throw e;
});
