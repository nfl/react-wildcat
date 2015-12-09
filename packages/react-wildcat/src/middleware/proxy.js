const request = require("request");

module.exports = function (proxyObject, options) {
    const proxyRoutes = Object.keys(proxyObject);

    proxyRoutes.forEach(function eachProxyRoute(proxyRoute) {
        const remoteServer = proxyObject[proxyRoute];
        options.logger.meta(`Proxy: ${proxyRoute} -> ${remoteServer}`);
    });

    return function* (next) {
        const req = this.request;
        const matchingRoute = proxyRoutes.filter(function prx(px) {
            return req.url.startsWith(px);
        })[0];

        if (matchingRoute) {
            return yield new Promise(function matchingRoutePromise(resolve, reject) {
                const host = proxyObject[matchingRoute];
                const pathname = req.url.replace(matchingRoute, "");

                request(`${host}${pathname}`, function matchingRouteRequest(err, response, body) {
                    /* istanbul ignore next */
                    if (err) {
                        return reject(err);
                    }

                    // Proxy over response headers
                    Object.keys(response.headers).forEach(function headers(h) {
                        this.set(h, response.headers[h]);
                    }.bind(this));

                    this.status = response.statusCode;
                    this.body = body;

                    return resolve();
                }.bind(this));
            }.bind(this));
        }

        return yield next;
    };
};
