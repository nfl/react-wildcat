const { context, resolve, rules, webpackPlugins } = require("./base.config.js");

module.exports = {
    mode: "development",
    cache: true,
    context,
    target: "web",
    devtool: "inline-source-map",

    // webpack configuration
    module: {
        rules
    },
    plugins: webpackPlugins(),
    resolve
};
