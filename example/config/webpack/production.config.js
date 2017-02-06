const cwd = process.cwd();
const path = require("path");
const nodeExternals = require("webpack-node-externals");

const __TEST__ = process.env.BABEL_ENV === "test";

const {
    nodeEnv,
    output,
    resolve,
    rules,
    webpackEntry,
    webpackPlugins
} = require("./base.config.js");

module.exports = [
    {
        cache: true,
        name: `client-side rendering <${nodeEnv}>`,
        entry: webpackEntry(),
        target: "web",
        devtool: false,
        output: Object.assign({}, output, __TEST__ ? {} : {
            chunkFilename: "[chunkhash].bundle.js"
        }),
        resolve,
        module: {
            rules
        },
        performance: {
            hints: "warning"
        },
        plugins: webpackPlugins({
            minify: !__TEST__
        })
    },

    {
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
        module: {
            rules
        },
        plugins: webpackPlugins({
            optimize: false,
            minify: false
        })
    }
];
