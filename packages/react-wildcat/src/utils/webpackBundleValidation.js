module.exports = function webpackBundleValidation(
    root,
    {__DEV__, logger, webpackDevSettings}
) {
    const path = require("path");
    const clearRequire = require("clear-require");

    if (__DEV__) {
        const webpack = require("webpack");

        const compiler = webpack(
            require(path.resolve(root, webpackDevSettings))
        );
        const watcher = compiler.watch({}, (err, stats) => {
            validate.ready({
                err,
                stats,
                watcher
            });
        });
    }

    const validate = {
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

        ready({err, stats, watcher}) {
            this._err = err;
            this._stats = stats;
            this._watcher = watcher;

            // Clear require caches and re-import
            // eslint-disable-next-line guard-for-in
            for (const asset in stats.compilation.assets) {
                clearRequire(stats.compilation.assets[asset].existsAt);
            }

            this._handlers.forEach(handler => {
                handler.call(handler, err, stats);
            });

            this._handlers = [];
        }
    };

    return validate;
};
