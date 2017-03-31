const {
    context,
    resolve,
    rules,
    webpackPlugins
} = require("./base.config.js");

module.exports = {
    cache: true,
    context,
    target: "web",
    devtool: "inline-source-map",

    // webpack configuration
    module: {
        rules
    },
    plugins: webpackPlugins({
        optimize: false,
        minify: false,
        progress: true
    }),
    resolve
};
