const request = require("request");

/**
 * Checks the local environment for a running server.
 * @return {Promise} Returns a promise, an eventual Boolean
 */
module.exports = async function checkServerStatus(origin) {
    try {
        return new Promise(resolve => {
            request(
                {
                    strictSSL: false,
                    url: origin
                },
                err => resolve(!!err)
            );
        });
    } catch (e) {
        return Promise.resolve(true);
    }
};
