const path = require("path");
const webpack = require("webpack");

const {
    cacheEnvDir,
    context,
    minimalStats,
    output,
    resolve,
    webpackPlugins
} = require("./base.config.js");

module.exports = {
    mode: "development",
    context,
    entry: {
        dependencies: [
            "babel-polyfill",
            "core-js",
            "d3",
            "fbjs",
            "radium",
            "react-dom",
            "react-helmet",
            "react-metrics",
            "react-router",
            "react-wildcat-handoff/client",
            "react-wildcat-prefetch",
            "react"
        ]
    },
    devtool: false,
    output: Object.assign({}, output, {
        library: "[name]"
    }),
    resolve,
    stats: minimalStats,
    plugins: webpackPlugins().concat([
        new webpack.DllPlugin({
            path: path.join(cacheEnvDir, "[name]-manifest.json"),
            name: "[name]"
        })
    ])
};
