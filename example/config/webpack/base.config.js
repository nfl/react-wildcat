const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const HappyPack = require("happypack");
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
    "react-hot-loader/patch",
    // activate HMR for React

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
            {
                loader: "happypack/loader"
            }
        ]
    },
    {
        test: /\.(css|png|jpg|jpeg|gif|svg)$/,
        include,
        exclude,
        use: [
            {
                loader: "url-loader"
            }
        ]
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

exports.webpackPlugins = (
    {
        hot = false,
        optimize = true,
        limit = undefined,
        minify = true,
        progress = false,
        threads = 4
    } = {}
) =>
    exports.plugins
        .concat(
            threads
                ? new HappyPack({
                      // loaders is the only required parameter:
                      loaders: [
                          {
                              loader: "babel-loader"
                          }
                      ],

                      // customize as needed, see Configuration below

                      // An object that is used to invalidate the cache between runs
                      // based on whatever variables that might affect the transformation
                      // of your sources, like NODE_ENV for example.
                      cacheContext: {
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

                          karmaConfig: require(path.resolve(
                              root,
                              "karma.config.js"
                          )),
                          protractorConfig: require(path.resolve(
                              root,
                              "protractor.config.js"
                          )),
                          wildcatConfig
                      },
                      threads,
                      tempDir: path.resolve(CACHE_ENV_DIR, "happypack"),
                      verbose: false
                  })
                : []
        )
        .concat(
            hot
                ? [
                      new webpack.HotModuleReplacementPlugin(),
                      // enable HMR globally

                      new webpack.NamedModulesPlugin(),
                      // prints more readable module names in the browser console on HMR updates

                      new webpack.NoEmitOnErrorsPlugin()
                  ]
                : []
        )
        .concat(
            optimize
                ? [
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
                  ]
                : []
        )
        .concat(
            minify
                ? [
                      new webpack.LoaderOptionsPlugin({
                          minimize: true,
                          debug: false
                      }),

                      new webpack.optimize.UglifyJsPlugin(exports.uglifyOptions)
                  ]
                : []
        )
        .concat(progress ? new ProgressBarPlugin() : [])
        .concat(
            limit
                ? [
                      new webpack.optimize.LimitChunkCountPlugin({
                          maxChunks: limit
                      })
                  ]
                : []
        );
