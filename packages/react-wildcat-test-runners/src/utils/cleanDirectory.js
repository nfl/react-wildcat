import rimraf from "rimraf";

/**
 * Cleans a specified directory
 * @return {Promise}        Returns a promise
 */
export default async function cleanDirectory(directory) {
    return new Promise((resolve, reject) => {
        if (!directory) {
            return reject(new Error("Directory not specified"));
        }

        rimraf(directory, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
}
