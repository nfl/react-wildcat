const request = require("request");

module.exports = function (proxyObject, options) {
    const proxyRoutes = Object.keys(proxyObject);

    proxyRoutes.forEach(proxyRoute => {
        const remoteServer = proxyObject[proxyRoute];
        options.logger.meta(`Proxy: ${proxyRoute} -> ${remoteServer}`);
    });

    return function* (next) {
        const req = this.request;
        const matchingRoute = proxyRoutes.filter(px => req.url.startsWith(px))[0];

        if (matchingRoute) {
            return yield new Promise((resolve, reject) => {
                const host = proxyObject[matchingRoute];
                const pathname = req.url.replace(matchingRoute, "");

                request(`${host}${pathname}`, (err, response, body) => {
                    /* istanbul ignore next */
                    if (err) {
                        return reject(err);
                    }

                    // Proxy over response headers
                    Object.keys(response.headers).forEach(h => {
                        this.set(h, response.headers[h]);
                    });

                    this.status = response.statusCode;
                    this.body = body;

                    return resolve();
                });
            });
        }

        return yield next;
    };
};
