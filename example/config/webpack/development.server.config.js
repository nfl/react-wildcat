const path = require("path");
const nodeExternals = require("webpack-node-externals");

const {
    context,
    minimalStats,
    nodeEnv,
    resolve,
    rules,
    webpackPlugins
} = require("./base.config.js");

module.exports = {
    // The configuration for the server-side rendering
    cache: true,
    context,
    name: `server-side rendering <${nodeEnv}>`,
    entry: {
        server: "./src/server.js"
    },
    target: "node",
    devtool: false,
    output: {
        path: path.resolve(context, "public"),
        filename: "[name].js",
        chunkFilename: "[id].js",
        libraryTarget: "commonjs2"
    },
    externals: nodeExternals(),
    resolve,
    module: {
        rules
    },
    plugins: webpackPlugins({
        optimize: false,
        minify: false
    }),
    stats: minimalStats
};
