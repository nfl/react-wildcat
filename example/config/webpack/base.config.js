const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const HappyPack = require("happypack");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const root = path.resolve(__dirname, "../..");

const {
    generalSettings: {
        env: {
            __DEV__,
            __TEST__,
            NODE_ENV = "development"
        },
        staticUrl
    }
} = require("react-wildcat/src/utils/getWildcatConfig")(root);

const CACHE_DIR = ".cache";
const CACHE_ENV_DIR = path.join(root, CACHE_DIR, NODE_ENV);
fs.ensureDirSync(CACHE_ENV_DIR);

const src = path.resolve(root, "src");

const include = [
    src // important for performance!
];

const exclude = [
    /lib|node_modules/
];

const hotEntries = [
    "react-hot-loader/patch",
    // activate HMR for React

    "event-source-polyfill",
    // hot-loader uses EventSource

    `webpack-hot-middleware/client?path=${staticUrl}/audible?reload=true`
    // bundle the client for hot reloading
];

exports.hotEntries = hotEntries;

exports.webpackEntry = ({
    hot = false
} = {}) => ({
    bootstrap: [
        "react",
        "react-dom"
    ],

    app: [
        ...(hot ? hotEntries : []),
        "./src/client.js"
    ]
});

exports.context = root;
exports.cacheDir = CACHE_DIR;
exports.cacheEnvDir = CACHE_ENV_DIR;

exports.externals = nodeExternals();

exports.rules = [
    {
        test: /\.js$/,
        include,
        exclude,
        use: [{
            loader: "happypack/loader"
        }]
    },
    {
        test: /\.(css|png|jpg|jpeg|gif|svg)$/,
        include,
        exclude,
        use: [{
            loader: "url-loader"
        }]
    }
];

exports.resolve = {
    alias: {
        // dedupe React
        "react": path.resolve(root, "node_modules", "react"),
        // dedupe React DOM
        "react-dom": path.resolve(root, "node_modules", "react-dom"),
        // dedupe React Helmet
        "react-helmet": path.resolve(root, "node_modules", "react-helmet")
    },
    modules: [
        src,
        "node_modules"
    ]
};

exports.minimalStats = {
    // Add asset Information
    assets: false,
    // Add information about cached (not built) modules
    cached: false,
    // Add children information
    children: false,
    // Add chunk information (setting this to `false` allows for a less verbose output)
    chunks: false,
    // Add built modules information to chunk information
    chunkModules: false,
    // Add the origins of chunks and chunk merging info
    chunkOrigins: false,
    // Add errors
    errors: true,
    // Add details to errors (like resolving log)
    errorDetails: true,
    // Add the hash of the compilation
    hash: false,
    // Add built modules information
    modules: false,
    // Add public path information
    publicPath: false,
    // Add information about the reasons why modules are included
    reasons: false,
    // Add the source code of modules
    source: false,
    // Add timing information
    timings: true,
    // Add webpack version information
    version: false,
    // Add warnings
    warnings: true
};

exports.__DEV__ = __DEV__;
exports.__TEST__ = __TEST__;

exports.output = {
    path: path.resolve(root, "bundles"),
    pathinfo: true,
    publicPath: `${staticUrl}/bundles/`,
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle.js"
};

exports.staticUrl = staticUrl;

exports.uglifyOptions = {
    sourceMap: false,
    minimize: true,
    compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
    },
    output: {
        comments: false
    }
};

exports.plugins = [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify(NODE_ENV)
        }
    }),

    new webpack.ContextReplacementPlugin((/moment[\/|\\]locale$/), (/de|fr|hu/)),

    new webpack.IgnorePlugin(/^\.\/lang$/, /moment$/),
    new webpack.IgnorePlugin(/\/iconv-loader$/)
];

exports.webpackPlugins = ({
    hot = false,
    optimize = true,
    limit = undefined,
    minify = true,
    progress = false,
    threads = 4
} = {}) => (
    exports.plugins
        .concat(
            threads ? new HappyPack({
                // loaders is the only required parameter:
                loaders: [
                    {
                        loader: "babel-loader"
                    }
                ],

                // customize as needed, see Configuration below
                threads,
                tempDir: path.resolve(CACHE_ENV_DIR, "happypack"),
                verbose: false
            }) : []
        )
        .concat(
            hot ? [
                new webpack.HotModuleReplacementPlugin(),
                // enable HMR globally

                new webpack.NamedModulesPlugin(),
                // prints more readable module names in the browser console on HMR updates

                new webpack.NoEmitOnErrorsPlugin()
            ] : []
        )
        .concat(
            optimize ? [
                // // This plugin prevents Webpack from creating chunks
                // // that would be too small to be worth loading separately
                // new webpack.optimize.MinChunkSizePlugin({
                //     minChunkSize: 51200 // ~50kb
                // }),
                //
                new webpack.optimize.CommonsChunkPlugin({
                    names: ["bootstrap", "manifest"] // Specify the common bundle's name.
                }),

                new webpack.optimize.CommonsChunkPlugin({
                    async: true,
                    children: true
                })
            ] : []
        )
        .concat(
            minify ? [
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                }),

                new webpack.optimize.UglifyJsPlugin(exports.uglifyOptions)
            ] : []
        )
        .concat(
            progress ? new ProgressBarPlugin() : []
        )
        .concat(
            limit ? [
                new webpack.optimize.LimitChunkCountPlugin({
                    maxChunks: limit
                })
            ] : []
        )
);
