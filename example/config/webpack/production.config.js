const path = require("path");
const nodeExternals = require("webpack-node-externals");

const __TEST__ = process.env.BABEL_ENV === "test";

const {
    context,
    nodeEnv,
    output,
    resolve,
    rules,
    webpackEntry,
    webpackPlugins
} = require("./base.config.js");

module.exports = [
    {
        name: `client-side rendering <${nodeEnv}>`,

        cache: true,
        context,
        devtool: false,
        entry: webpackEntry(),
        module: {
            rules
        },
        output: Object.assign({}, output, __TEST__ ? {} : {
            chunkFilename: "[chunkhash].bundle.js"
        }),
        performance: {
            hints: "warning"
        },
        plugins: webpackPlugins({
            minify: !__TEST__
        }),
        resolve,
        target: "web"
    },

    {
        // The configuration for the server-side rendering
        name: `server-side rendering <${nodeEnv}>`,

        cache: true,
        context,
        devtool: false,
        entry: {
            server: "./src/server.js"
        },
        externals: nodeExternals(),
        module: {
            rules
        },
        output: {
            path: path.resolve(context, "public"),
            filename: "[name].js",
            chunkFilename: "[id].js",
            libraryTarget: "commonjs2"
        },
        plugins: webpackPlugins({
            optimize: false,
            minify: false
        }),
        target: "node"
    }
];
