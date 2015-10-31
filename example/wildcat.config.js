var pkg = require("./package.json");

/* istanbul ignore next */
var wildcatConfig = {
    generalSettings: {
        // Grab the config file from package.json
        jspmConfigFile: pkg.configFile || (pkg.jspm || {}).configFile || "config.js",

        // Project name
        name: pkg.name,

        // These are mainly ingested on the server side

        // Canonical origin server url
        originUrl: process.env.ORIGIN_URL || "https://localhost:3000",

        // Canonical static server url
        staticUrl: process.env.STATIC_URL || "https://localhost:4000",

        // Project version
        version: pkg.version
    },

    clientSettings: {
        // Path to the entry config file relative to the project root
        entry: "public/main.js",

        // Path to the client renderer. This can be a jspm package or a relative path
        renderHandler: "react-wildcat-handoff/client",

        // The target element id where React will be injected
        reactRootElementID: "content"
    },

    serverSettings: {
        // Directory to save raw binaries (jpg, gif, fonts, etc)
        binDir: "bin",

        // An array of domains to allow for cross-origin requests
        corsOrigins: [
            "localhost",
            "example.com"
        ],

        // BYO-HTML template
        // htmlTemplate: require("./customHTMLTemplate.js"),

        // Graylog config options for the node server
        // https://www.npmjs.com/package/gelf-pro#configuration
        // graylog: {},

        // Enable http2
        http2: false,

        // Enable https
        https: true,

        // Default port number
        port: 3000,

        // A key/value of urls to proxy
        // e.g. /static -> http://example.com/static
        proxies: {
            "/static": "http://example.com/static"
        },

        // Directory to output compiled JavaScript modules
        publicDir: "public",

        // Path to the entry config file relative to the project root
        entry: "public/main.js",

        // Path to the server renderer. This can be a jspm package or a relative path
        renderHandler: "react-wildcat-handoff/server",

        // Path to your source JavaScript files
        sourceDir: "src"
    }
};

module.exports = wildcatConfig;
