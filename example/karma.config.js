const cwd = process.cwd();
const path = require("path");

const wildcatConfig = require(path.join(cwd, "wildcat.config.js"));

const generalSettings = wildcatConfig.generalSettings;
const coverageSettings = generalSettings.coverageSettings;

// Karma configuration
module.exports = function(karmaConfig) {
    const unitReportDir = coverageSettings.unit.reporting.dir;
    const unitInstrumentation = coverageSettings.unit.instrumentation;

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
                timeout: 30000
            }
        },

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        coverageReporter: {
            dir: unitReportDir,
            includeAllSources: true,
            reporters: [
                {
                    type: "html"
                },
                {
                    type: "text"
                }
            ]
        },

        instrumenterOptions: {
            istanbul: unitInstrumentation
        },

        // list of files to exclude
        exclude: [],

        files: [
            {
                pattern: "./node_modules/babel-polyfill/dist/polyfill.js",
                included: true,
                watched: false
            },
            {
                pattern: "./src/test/unit/phantomShims.js",
                included: true,
                watched: false
            },
            {
                pattern: "./src/test/unit/tests.js"
            }
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["phantomjs-shim", "mocha"],

        // level of logging
        // possible values: karmaConfig.LOG_DISABLE || karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN || karmaConfig.LOG_INFO || karmaConfig.LOG_DEBUG
        logLevel: karmaConfig.LOG_INFO,

        // web server port
        port: 9876,

        preprocessors: {
            "./src/test/unit/tests.js": ["webpack"]
        },

        proxyValidateSSL: false,

        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["coverage", "mocha"],

        webpack: require("./config/webpack/karma.config.js"),

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
