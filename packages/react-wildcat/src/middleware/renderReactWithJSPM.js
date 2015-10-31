const pageHandler = require("../utils/pageHandler");

module.exports = function (options) {
    const cache = options.cache || {};
    const wildcatConfig = options.wildcatConfig;

    return function* () {
        const cookies = this.cookies;
        const request = this.request;
        const response = this.response;

        const file = cache[request.url] || {};

        response.status = 200;
        response.type = "text/html";
        response.lastModified = file.lastModified || new Date().toGMTString();

        var reply;

        if (request.fresh && file.cache) {
            reply = file.cache;
        } else {
            var data = yield pageHandler(request, cookies, wildcatConfig);
            reply = data.reply;

            // Save to cache
            cache[request.url] = {
                cache: reply,
                lastModified: response.get("last-modified"),
                packageCache: data.packageCache,
                status: 304
            };
        }

        if (reply.type) {
            response.type = reply.type;
        }

        if (reply.status) {
            this.status = reply.status;
        }

        if (reply.redirect === true) {
            const redirectLocation = reply.redirectLocation;
            return this.redirect(`${redirectLocation.pathname}${redirectLocation.search}`);
        }

        if (reply.error) {
            return this.body = reply.error;
        }

        return this.body = reply.html;
    };
};
