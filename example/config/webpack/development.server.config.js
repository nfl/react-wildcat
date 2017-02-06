const cwd = process.cwd();
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = function webpackDevConfig() {
    const {
        minimalStats,
        nodeEnv,
        resolve,
        rules,
        webpackPlugins
    } = require("./base.config.js");

    return {
        // The configuration for the server-side rendering
        cache: true,
        name: `server-side rendering <${nodeEnv}>`,
        entry: {
            server: "./src/server.js"
        },
        target: "node",
        devtool: false,
        output: {
            path: path.resolve(cwd, "public"),
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
};
