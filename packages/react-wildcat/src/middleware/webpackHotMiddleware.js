const createExpressMiddleware = require("webpack-hot-middleware");

module.exports = function webpackHotMiddleware(compiler, options) {
    const expressMiddleware = createExpressMiddleware(compiler, options);

    return function* hotMiddleware(next) {
        const {req, res} = this;

        yield done => {
            expressMiddleware(req, res, () => {
                done(null);
            });
        };

        yield next;
    };
};
