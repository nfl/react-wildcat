const CircularDependencyPlugin = require("circular-dependency-plugin");
const VisualizerPlugin = require("webpack-visualizer-plugin");

const {
    context,
    nodeEnv,
    output,
    resolve,
    rules,
    webpackEntry,
    webpackPlugins
} = require("./base.config.js");

module.exports = {
    cache: true,
    context,
    name: `client-side rendering <${nodeEnv}>`,
    entry: webpackEntry(),
    target: "web",
    devtool: false,
    output,
    resolve,
    module: {
        rules
    },
    performance: {
        hints: "warning"
    },
    plugins: webpackPlugins({
        minify: false,
        progress: true
    }).concat([
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /node_modules/
        }),

        new VisualizerPlugin({
            filename: "stats.html"
        })
    ]),
    profile: true,
    stats: {
        assets: true,
        cached: true,
        children: true,
        chunks: true,
        chunkModules: true,
        chunkOrigins: true,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true,
        modules: true,
        publicPath: true,
        reasons: true,
        source: true,
        timings: true,
        version: true,
        warnings: true
    }
};
