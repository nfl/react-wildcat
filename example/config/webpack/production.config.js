const path = require("path");
const nodeExternals = require("webpack-node-externals");

const {
    context,
    isTestEnv,
    nodeEnv,
    output,
    resolve,
    rules,
    webpackEntry,
    webpackPlugins
} = require("./base.config.js");

const {MINIFY} = process.env;
const __MINIFY__ = MINIFY === "true" || MINIFY === "1" || !isTestEnv;

module.exports = [
    {
        mode: "production",
        name: `client-side rendering <${nodeEnv}>`,
        cache: true,
        context,
        devtool: false,
        entry: webpackEntry(),
        module: {
            rules
        },
        output: Object.assign(
            {},
            output,
            __MINIFY__
                ? {
                      chunkFilename: "[chunkhash].bundle.js"
                  }
                : {}
        ),
        performance: {
            hints: "warning"
        },
        optimization: {
            minimize: __MINIFY__
        },
        plugins: webpackPlugins(),
        resolve,
        target: "web"
    },
    {
        mode: "development",
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
        plugins: webpackPlugins(),
        stats: {
            assets: false,
            cached: false,
            children: false,
            chunks: false,
            chunkModules: false,
            chunkOrigins: true,
            colors: true,
            errors: true,
            errorDetails: true,
            hash: true,
            modules: false,
            publicPath: true,
            reasons: true,
            source: false,
            timings: true,
            version: false,
            warnings: true
        },
        target: "node"
    }
];
