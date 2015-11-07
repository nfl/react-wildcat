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
        // Path to the entry config file relative to the project root
        entry: "public/main.js",

        // Path to the server renderer. This can be a jspm package or a relative path
        renderHandler: "react-wildcat-handoff/server",

        // Directory to save raw binaries (jpg, gif, fonts, etc)
        binDir: "bin",

        // BYO-HTML template
        // htmlTemplate: require("./customHTMLTemplate.js"),

        // Graylog config options for the node server
        // https://www.npmjs.com/package/gelf-pro#configuration
        // graylog: {},

        // Directory to output compiled JavaScript modules
        publicDir: "public",

        // Path to your source JavaScript files
        sourceDir: "src",

        // config options for the app server
        appServer: {
            // Enable http2
            http2: true,

            // Enable https
            // Only applicable if http2 is false
            // https: true,

            // App server port
            port: process.env.PORT || 3000,

            // A key/value of urls to proxy
            // e.g. /static -> http://example.com/static
            proxies: {
                "/static": "http://example.com/static"
            }

            // Only applicable when one of http2/https is true
            // https://github.com/indutny/node-spdy#options
            // secureSettings: {
                // Provide your own key / cert / ca
                // key: fs.readFileSync("./ssl/appServer.key"),
                // cert: fs.readFileSync("./ssl/appServer.crt"),
                // ca: fs.readFileSync("./ssl/appServer.csr"),

                // If using http2, use the following protocols
                // protocols: [
                //     "h2",
                //     "spdy/3.1",
                //     "spdy/3",
                //     "spdy/2",
                //     "http/1.1",
                //     "http/1.0"
                // ]
            // }
        },

        // config options for the static server
        staticServer: {
            // An array of domains to allow for cross-origin requests
            corsOrigins: [
                "localhost",
                "example.com"
            ],

            // Enable http2
            http2: true,

            // Enable https
            // Only applicable if http2 is false
            // https: true,

            // App server port
            port: process.env.STATIC_PORT || 4000

            // Only applicable when one of http2/https is true
            // https://github.com/indutny/node-spdy#options
            // secureSettings: {
                // Provide your own key / cert / ca
                // key: fs.readFileSync("./ssl/appServer.key"),
                // cert: fs.readFileSync("./ssl/appServer.crt"),
                // ca: fs.readFileSync("./ssl/appServer.csr"),

                // If using http2, use the following protocols
                // protocols: [
                //     "h2",
                //     "spdy/3.1",
                //     "spdy/3",
                //     "spdy/2",
                //     "http/1.1",
                //     "http/1.0"
                // ]
            // }
        }
    }
};

module.exports = wildcatConfig;
