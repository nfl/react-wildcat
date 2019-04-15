const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const root = path.resolve(__dirname, "../..");

const wildcatConfig = require("react-wildcat/src/utils/getWildcatConfig")(root);

const {
    generalSettings: {
        env: {__TEST__, BABEL_ENV, NODE_ENV = "development"},
        staticUrl
    }
} = wildcatConfig;

const CACHE_DIR = ".cache";
const CACHE_ENV_DIR = path.join(root, CACHE_DIR, NODE_ENV);
fs.ensureDirSync(CACHE_ENV_DIR);

const src = path.resolve(root, "src");

const include = [
    src // important for performance!
];

const exclude = [/lib|node_modules/];

const hotEntries = [
    "event-source-polyfill",
    // hot-loader uses EventSource

    `webpack-hot-middleware/client?path=${staticUrl}/audible?reload=true`
    // bundle the client for hot reloading
];

exports.hotEntries = hotEntries;

exports.webpackEntry = ({hot = false} = {}) => ({
    bootstrap: ["react", "react-dom"],

    app: [...(hot ? hotEntries : []), "./src/client.js"]
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
        use: [
            {loader: "thread-loader"},
            {
                loader: "babel-loader",
                options: {
                    cacheIdentifier: {
                        BABEL_ENV,
                        NODE_ENV,
                        babelRc: JSON.parse(
                            fs.readFileSync(
                                path.resolve(root, ".babelrc"),
                                "utf8"
                            )
                        ),
                        nodeVersion: fs.readFileSync(
                            path.resolve(root, ".node-version"),
                            "utf8"
                        ),
                        packageJSON: require(path.resolve(
                            root,
                            "package.json"
                        )),
                        yarnLock: fs.readFileSync(
                            path.resolve(root, "yarn.lock"),
                            "utf8"
                        ),
                        protractorConfig: require(path.resolve(
                            root,
                            "protractor.config.js"
                        )),
                        wildcatConfig
                    }
                }
            }
        ]
    },
    {
        test: /\.(css|png|jpg|jpeg|gif|svg)$/,
        include,
        exclude,
        use: "url-loader"
    }
];

exports.resolve = {
    alias: {
        // dedupe React
        react: path.resolve(root, "node_modules", "react"),
        // dedupe React DOM
        "react-dom": path.resolve(root, "node_modules", "react-dom"),
        // dedupe React Helmet
        "react-helmet": path.resolve(root, "node_modules", "react-helmet")
    },
    modules: [src, "node_modules"]
};

exports.minimalStats = {
    assets: false,
    cached: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    errors: true,
    errorDetails: true,
    hash: false,
    modules: false,
    publicPath: false,
    reasons: false,
    source: false,
    timings: true,
    version: false,
    warnings: true
};

exports.isTestEnv = __TEST__;
exports.nodeEnv = NODE_ENV;

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

    new webpack.ContextReplacementPlugin(/moment[\/|\\]locale$/, /de|fr|hu/),

    new webpack.IgnorePlugin(/^\.\/lang$/, /moment$/),
    new webpack.IgnorePlugin(/\/iconv-loader$/)
];

exports.webpackPlugins = ({hot = false, progress = true} = {}) =>
    exports.plugins
        .concat(hot ? new webpack.HotModuleReplacementPlugin() : [])
        .concat(progress ? new ProgressBarPlugin() : []);
