"use strict";
const memwatch = require("memwatch-next");

function memory(logger) {
    logger = logger || console;

    logger.info("Watching memory...");

    memwatch.on("leak", function MemwatchLeak(info) {
        logger.info(`${JSON.stringify(info)}`, {
            debug: "MemwatchLeak"
        });
    });

    let firstLine = true;

    memwatch.on("stats", function MemwatchOn(memstats) {
        let info = [];
        const stats = memstats || {};

        if (firstLine) {
            info.push("num_full_gc");
            info.push("num_inc_gc");
            info.push("heap_compactions");
            info.push("usage_trend");
            info.push("estimated_base");
            info.push("current_base");
            info.push("min");
            info.push("max");
            logger.info(`${info.join(",")}`, {
                debug: "MemwatchStats"
            });
            info = [];
            firstLine = false;
        }

        info.push(stats.num_full_gc);
        info.push(stats.num_inc_gc);
        info.push(stats.heap_compactions);
        info.push(stats.usage_trend);
        info.push(stats.estimated_base);
        info.push(stats.current_base);
        info.push(stats.min);
        info.push(stats.max);

        logger.info(`${info.join(",")}`, {
            debug: "MemwatchStats"
        });
    });
}

module.exports = memory;
