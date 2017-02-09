module.exports = function renderReactWithWebpack(root, options) {
    const path = require("path");
    const clearRequire = require("clear-require");

    const blueBoxOfDeath = require("../utils/blueBoxOfDeath");
    const Convert = require("ansi-to-html");
    const convert = new Convert();

    const {
        logger,
        wildcatConfig
    } = options;

    const {
        generalSettings: {
            env: {
                __DEV__
            }
        },
        serverSettings: {
            displayBlueBoxOfDeath,
            entry,
            webpackDevSettings
        }
    } = wildcatConfig;

    const webpack = {
        _err: undefined,
        _handlers: [],
        _stats: undefined,
        _watcher: undefined,

        onReady(callback) {
            if (!__DEV__ || (this._watcher && !this._watcher.invalid)) {
                return callback.call(callback, this._err, this._stats);
            }

            logger.info(`webpack: wait until bundle finished`);
            return this._handlers.push(callback);
        },

        ready({
            err,
            stats,
            watcher
        }) {
            this._err = err;
            this._stats = stats;
            this._watcher = watcher;

            // Clear require caches and re-import
            for (const asset in stats.compilation.assets) { // eslint-disable-line guard-for-in
                clearRequire(stats.compilation.assets[asset].existsAt);
            }

            this._handlers.forEach(handler => {
                handler.call(handler, err, stats);
            });

            this._handlers = [];
        }
    };

    if (__DEV__) {
        const w = require("webpack");

        const compiler = w(require(path.resolve(root, webpackDevSettings)));
        const watcher = compiler.watch({}, (err, stats) => {
            webpack.ready({
                err,
                stats,
                watcher
            });
        });
    }

    function pageHandler(request, cookies) {
        return new Promise((resolve, reject) => {
            webpack.onReady((err, stats) => {
                if (err) {
                    return reject(err);
                }

                if (displayBlueBoxOfDeath && stats && stats.hasErrors()) {
                    return resolve({
                        error: blueBoxOfDeath(stats.compilation.errors.map(e => ({
                            message: convert.toHtml(e.error),
                            id: e.module.id
                        })), request),
                        status: 500
                    });
                }

                // Load the server files from the current file system
                const render = require(path.resolve(root, entry)).default;
                const reply = render(request, cookies, wildcatConfig);

                return resolve(
                    // Return the original reply
                    reply
                );
            });
        })
            .catch(err => {
                logger.error(err);

                if (displayBlueBoxOfDeath) {
                    return {
                        error: blueBoxOfDeath(err, request),
                        status: 500
                    };
                }

                return {
                    error: err.stack,
                    status: 500
                };
            });
    }

    return function* render() {
        const {
            cookies,
            request,
            response
        } = this;

        response.status = 200;
        response.type = "text/html";

        const reply = yield pageHandler(request, cookies);

        this.status = reply.status || response.status;

        if (reply.redirect === true) {
            const {
                redirectLocation
            } = reply;
            return this.redirect(`${redirectLocation.pathname}${redirectLocation.search}`);
        }

        if (reply.error) {
            return this.body = reply.error;
        }

        return this.body = reply.html;
    };
};
