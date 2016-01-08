import {spawn} from "child_process";

const childProcesses = new Set();

/**
 * A promise-based process spawner
 * @param  {String}  command A command to run on a separate process
 * @param  {Object}  options Options to pass to the spawner (https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
 * @return {Promise}         Returns a promise, resolves when the process is complete
 */
export default async function yawn(command, options = {
    stdio: "inherit"
}) {
    const [cmd, ...npmArgs] = command.trim().split(" ");
    const {resolveWhenLineIncludes} = options;

    return new Promise((resolve, reject) => {
        if (resolveWhenLineIncludes && !options.stdio) {
            options = {
                ...options,
                stdio: [0, "pipe", 2]
            };
        }
        const child = spawn(cmd, npmArgs, options);

        if (resolveWhenLineIncludes) {
            child.stdout.on("data", data => {
                if (!data) {
                    return reject(data);
                }

                let foundMatch = false;
                const string = data.toString();

                if (options.printStdout) {
                    process.stdout.write(string);
                }

                string.split("\n").forEach(line => {
                    if (!foundMatch && line.trim().includes(resolveWhenLineIncludes)) {
                        foundMatch = true;

                        process.stdout.write("\n");
                        return resolve();
                    }
                });
            });
        } else {
            child.on("exit", (code) => {
                if (code !== 0) {
                    return reject(code);
                }

                childProcesses.delete(child);
                return resolve();
            });

            child.on("error", (e) => {
                childProcesses.delete(child);
                return reject(e);
            });
        }

        childProcesses.add(child);
    });
}


/**
 * Kills all tracked child processes
 * @param  {Number} signal
 * @return {undefined}
 */
function killAllChildProcesses(signal) {
    childProcesses.forEach(childProcess => childProcess.kill(signal));
}

process.on("exit", () => process.emit("SIGINT"));
process.on("SIGINT", () => killAllChildProcesses("SIGINT"));
process.on("uncaughtException", (e) => {
    killAllChildProcesses("SIGINT");
    throw e;
});
