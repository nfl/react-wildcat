const nodeExternals = require("webpack-node-externals");
const CircularDependencyPlugin = require("circular-dependency-plugin");

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
    externals: nodeExternals(),
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
        })
    ]),
    profile: true,
    stats: {
        // Add asset Information
        assets: true,
        // // Sort assets by a field
        // assetsSort: "field",
        // Add information about cached (not built) modules
        cached: true,
        // Add children information
        children: true,
        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: true,
        // Add built modules information to chunk information
        chunkModules: true,
        // Add the origins of chunks and chunk merging info
        chunkOrigins: true,
        // // Sort the chunks by a field
        // chunksSort: "field",
        // // Context directory for request shortening
        // context: "../src/",
        // `webpack --colors` equivalent
        colors: true,
        // Add errors
        errors: true,
        // Add details to errors (like resolving log)
        errorDetails: true,
        // Add the hash of the compilation
        hash: true,
        // Add built modules information
        modules: true,
        // // Sort the modules by a field
        // modulesSort: "field",
        // Add public path information
        publicPath: true,
        // Add information about the reasons why modules are included
        reasons: true,
        // Add the source code of modules
        source: true,
        // Add timing information
        timings: true,
        // Add webpack version information
        version: true,
        // Add warnings
        warnings: true
    }
};
