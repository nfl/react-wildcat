const cwd = process.cwd();
const path = require("path");

// Karma configuration
module.exports = function(karmaConfig) {
    const timeout = process.env.TIMEOUT || 10000;

    karmaConfig.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // How long will Karma wait for a message from a browser before disconnecting from it (in ms).
        browserNoActivityTimeout: 20000,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["PhantomJS"],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        client: {
            mocha: {
                bail: true,
                reporter: "html",
                slow: timeout / 2,
                timeout
            }
        },

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        coverageReporter: {
            type: "json",
            dir: "coverage/browser"
        },

        files: [
            {
                pattern: "./node_modules/whatwg-fetch/fetch.js",
                watched: false
            },
            {
                pattern: "./node_modules/babel-polyfill/dist/polyfill.js",
                watched: false
            },
            {
                pattern: "./test/test.js"
            }
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["phantomjs-shim", "mocha"],

        // level of logging
        // possible values: karmaConfig.LOG_DISABLE || karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN || karmaConfig.LOG_INFO || karmaConfig.LOG_DEBUG
        logLevel: karmaConfig.LOG_DEBUG,

        // web server port
        port: 9876,

        preprocessors: {
            "./test/test.js": ["webpack"]
        },

        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["coverage", "mocha"],

        webpack: {
            cache: true,
            target: "web",
            devtool: "inline-source-map",

            // webpack configuration
            module: {
                rules: [
                    {
                        test: /\.js/,
                        exclude: /lib|node_modules/,
                        use: [
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true,
                                    plugins: [
                                        [
                                            "istanbul",
                                            {
                                                exclude: [
                                                    "**/node_modules/**",
                                                    "**/test/**",
                                                    "**/Test*",
                                                    "**/defaultTemplate.js",
                                                    "**/getDomainRoutes.js"
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            resolve: {
                alias: {
                    // dedupe React
                    react: path.resolve(cwd, "node_modules", "react"),
                    // dedupe React DOM
                    "react-dom": path.resolve(cwd, "node_modules", "react-dom")
                },
                modules: ["node_modules"]
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            progress: false,
            stats: false,
            debug: false,
            noInfo: true
        },

        plugins: [
            require("karma-coverage"),
            require("karma-mocha"),
            require("karma-mocha-reporter"),
            require("karma-phantomjs-launcher"),
            require("karma-phantomjs-shim"),
            require("karma-webpack")
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
