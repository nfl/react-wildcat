import request from "request";

/**
 * Checks the local environment for a running server.
 * @return {Promise} Returns a promise, an eventual Boolean
 */
export default async function checkServerStatus(origin) {
    try {
        return new Promise(resolve => {
            request({
                strictSSL: false,
                url: origin
            }, err => resolve(!!err));
        });
    } catch (e) {
        return Promise.resolve(true);
    }
}
