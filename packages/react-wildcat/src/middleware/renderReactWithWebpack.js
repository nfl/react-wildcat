module.exports = function renderReactWithWebpack(root, options) {
    const fs = require("fs-extra");
    const path = require("path");
    const clearRequire = require("clear-require");

    const blueBoxOfDeath = require("../utils/blueBoxOfDeath");
    const Convert = require("ansi-to-html");
    const convert = new Convert();

    const __PROD__ = (process.env.NODE_ENV === "production");

    const {
        logger,
        wildcatConfig
    } = options;

    const {
        generalSettings: {
            webpackDevConfigFile
        },
        serverSettings: {
            displayBlueBoxOfDeath,
            entry,
            renderHandler
        }
    } = wildcatConfig;

    const webpack = {
        _err: undefined,
        _handlers: [],
        _stats: undefined,
        _watcher: undefined,

        onReady(callback) {
            if (this._watcher && !this._watcher.invalid) {
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

            // Clear require cache and re-import
            clearRequire.all();

            this._handlers.forEach(handler => {
                handler.call(handler, err, stats);
            });

            this._handlers = [];
        }
    };

    if (!__PROD__) {
        const w = require("webpack");

        if (fs.existsSync(webpackDevConfigFile)) {
            const {
                server: {
                    devConfig
                }
            } = require(path.resolve(root, webpackDevConfigFile));

            const compiler = w(devConfig);
            const watcher = compiler.watch({}, (err, stats) => {
                webpack.ready({
                    err,
                    stats,
                    watcher
                });
            });
        }
    }

    function pageHandler(request, cookies) {
        try {
            return new Promise((resolve, reject) => {
                webpack.onReady((err, stats) => {
                    if (err) {
                        return reject(err);
                    }

                    if (displayBlueBoxOfDeath && stats.hasErrors()) {
                        return resolve({
                            error: blueBoxOfDeath(stats.compilation.errors.map(e => ({
                                message: convert.toHtml(e.error),
                                id: e.module.id
                            })), request),
                            status: 500
                        });
                    }

                    // Load the server files from the current file system
                    const serverOptions = (typeof entry === "string") ? require(path.resolve(root, entry)) : entry;
                    const server = require(renderHandler);

                    const render = server(serverOptions.default || serverOptions);
                    const reply = render(request, cookies, wildcatConfig);

                    return resolve(
                        // Return the original reply
                        reply
                    );
                });
            });
        } catch (err) {
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
        }
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
