var cwd = process.cwd();
var path = require("path");
var wildcatConfig = require(path.join(cwd, "wildcat.config"));
var clientSettings = wildcatConfig.clientSettings;
var generalSettings = wildcatConfig.generalSettings;

require("babel/register")({
    resolveModuleSource: function (importPath) {
        if (/^src/.test(importPath)) {
            importPath = path.join(cwd, importPath);
        }

        return importPath;
    },
    retainLines: true,
    sourceRoot: __dirname
});

var timeout = 30000;

/* global browser */
exports.config = {
    // The timeout in milliseconds for each script run on the browser. This should
    // be longer than the maximum time your application needs to stabilize between
    // tasks.
    allScriptsTimeout: timeout + 1000,

    baseUrl: generalSettings.originUrl,

    // Boolean. If true, Protractor will connect directly to the browser Drivers
    // at the locations specified by chromeDriver and firefoxPath. Only Chrome
    // and Firefox are supported for direct connect.
    directConnect: true,

    framework: "mocha",

    getMultiCapabilities: function () {
        var browser = this.browser;

        if (browser) {
            var matchingCapabilities = this.multiCapabilities.filter(function (capabilities) {
                return capabilities.browserName === browser;
            })[0];

            if (matchingCapabilities) {
                return matchingCapabilities;
            }

            return this.capabilities;
        }

        return this.multiCapabilities;
    },

    // How long to wait for a page to load.
    getPageTimeout: timeout,

    mochaOpts: {
        bail: true,
        slow: timeout / 2,
        timeout: timeout,
        reporter: "spec"
    },

    multiCapabilities: [{
        acceptSslCerts: true,
        browserName: "chrome"
    }/*, {
        acceptSslCerts: true,
        browserName: "firefox"
    }*/],

    onPrepare: function () {
        var chai = require("chai");
        var chaiAsPromised = require("chai-as-promised");

        chai.config.includeStack = true;
        chai.use(chaiAsPromised);

        var browserWidth = 1024;

        // Some insane height to make the browser 100% high
        var browserHeight = 9999;

        // Move right to view tests in the background
        var browserOffset = 800;

        browser.driver.manage().window().setSize(browserWidth, browserHeight);
        browser.driver.manage().window().setPosition(browserOffset, 0);

        browser.ignoreSynchronization = true;
    },

    params: {
        maxTimeout: 5000,
        originUrl: generalSettings.originUrl
    },

    plugins: [],

    rootElement: `#${clientSettings.reactRootElementID}`,

    specs: ["src/**/*SpecRunner.js"]
};
