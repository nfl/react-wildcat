const rimraf = require("rimraf");

/**
 * Cleans a specified directory
 * @return {Promise}        Returns a promise
 */
module.exports = async function cleanDirectory(directory) {
    return new Promise((resolve, reject) => {
        if (!directory) {
            return reject(new Error("Directory not specified"));
        }

        return rimraf(directory, err => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
};
