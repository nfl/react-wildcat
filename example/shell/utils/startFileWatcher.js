import yawn from "./yawn.js";
import {testEnv} from "./envFlags.js";

const WATCHER_AVAILABLE_STRING = `Watching local files for code changes`;
const args = process.argv.slice(2);

/**
 * Starts a local file watcher
 * @return {Promise}        Returns a promise
 */
export default async function startFileWatcher() {
    return yawn(`${testEnv} npm run compile -- --ignore '**/!(*Test).*' --watch`, {
        resolveWhenLineIncludes: WATCHER_AVAILABLE_STRING,
        printStdout: args.includes("--verbose")
    });
}
