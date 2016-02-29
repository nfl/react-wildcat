import yawn from "./yawn.js";
import {argv} from "yargs";
import {testEnv} from "./envFlags.js";

const WATCHER_AVAILABLE_STRING = "Watching local files for code changes";

/**
 * Starts a local file watcher
 * @return {Promise}        Returns a promise
 */
export default async function startFileWatcher() {
    const cmd = [
        "wildcat-babel",
        "--copy-files",
        "--binary-to-module",
        "--ignore '**/!(*Test).*'",
        "--watch",
        "src",
        "--out-dir public"
    ];

    return yawn(`${testEnv} ${cmd.join(" ")}`, {
        resolveWhenLineIncludes: WATCHER_AVAILABLE_STRING,
        printStdout: argv.verbose
    });
}
