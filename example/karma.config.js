"use strict";

const cwd = process.cwd();
const url = require("url");
const path = require("path");

const wildcatConfig = require(path.join(cwd, "wildcat.config.js"));

const generalSettings = wildcatConfig.generalSettings;
const coverageSettings = generalSettings.coverageSettings;
const serverSettings = wildcatConfig.serverSettings;
const staticServerSettings = serverSettings.staticServer;

const staticUrl = url.format({
    protocol: staticServerSettings.protocol.replace("http2", "https"),
    hostname: staticServerSettings.hostname,
    port: staticServerSettings.port
});

// Karma configuration
module.exports = function (karmaConfig) {
    const unitTestReportDir = coverageSettings.reports.unit;

    function normalizationBrowserName(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
    }

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
                reporter: "html",
                timeout: 30000
            }
        },

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        coverageReporter: {
            dir: unitTestReportDir,
            includeAllSources: true,
            reporters: [
                {
                    type: "text",
                    subdir: normalizationBrowserName
                },
                {
                    type: "html",
                    subdir: normalizationBrowserName
                }
            ]
        },

        // list of files to exclude
        exclude: [],

        files: [{
            pattern: "./src/test/unit/phantomShims.js",
            included: true,
            watched: false
        }],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            "phantomjs-shim",
            "chai-sinon",
            "jspm",
            "mocha"
        ],

        jspm: {
            config: "system.config.js",
            loadFiles: ["public/**/*Test.js"]
        },

        // level of logging
        // possible values: karmaConfig.LOG_DISABLE || karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN || karmaConfig.LOG_INFO || karmaConfig.LOG_DEBUG
        logLevel: karmaConfig.LOG_INFO,

        // web server port
        port: 9876,

        proxies: {
            "/base": staticUrl
        },

        proxyValidateSSL: false,

        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["coverage", "mocha"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
