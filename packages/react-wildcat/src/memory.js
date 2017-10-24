const memwatch = require("memwatch-sigusr2");
const heapdump = require("heapdump");

function memory(logger) {
    memwatch.setup();
    logger = logger || console;

    heapdump.writeSnapshot((err, filename) => {
        logger.info("Dump written to: ", filename);
    });

    logger.info("Watching memory...");

    memwatch.on("leak", function MemwatchLeak(info) {
        logger.info(`${JSON.stringify(info)}`, {
            debug: "MemwatchLeak"
        });
    });

    let firstLine = true;

    memwatch.on("stats", function MemwatchOn(memstats = {}) {
        let info = [];

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

        info.push(memstats.num_full_gc);
        info.push(memstats.num_inc_gc);
        info.push(memstats.heap_compactions);
        info.push(memstats.usage_trend);
        info.push(memstats.estimated_base);
        info.push(memstats.current_base);
        info.push(memstats.min);
        info.push(memstats.max);

        logger.info(`${info.join(",")}`, {
            debug: "MemwatchStats"
        });
    });
}

module.exports = memory;
