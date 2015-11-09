var fs = require("fs-extra");
var path = require("path");

/* istanbul ignore next */
var wildcatConfig = {
    generalSettings: {
        // Grab the config file from package.json
        jspmConfigFile: "config.js",

        // Project name
        name: undefined,

        // Project version
        version: undefined
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
            // One of "http2" | "https" | "http"
            protocol: "http2",

            // App server hostname
            // Note: this should be a public facing domain
            hostname: "localhost",

            // App server port
            port: process.env.PORT || 3000,

            // A key/value of urls to proxy
            // e.g. /static -> http://example.com/static
            proxies: {},

            // Only applicable when protocol is one of http2 / https
            // https://github.com/indutny/node-spdy#options
            secureSettings: {
                // Provide your own key / cert / ca
                key: fs.readFileSync(path.join(__dirname, "../../../ssl/server.key")),
                cert: fs.readFileSync(path.join(__dirname, "../../../ssl/server.crt")),
                ca: fs.readFileSync(path.join(__dirname, "../../../ssl/server.csr")),

                // If using http2, use the following protocols
                protocols: [
                    "h2",
                    "spdy/3.1",
                    "spdy/3",
                    "spdy/2",
                    "http/1.1",
                    "http/1.0"
                ]
            }
        },

        // config options for the static server
        staticServer: {
            // An array of domains to allow for cross-origin requests
            corsOrigins: [
                "localhost",
                "example.com"
            ],

            // One of "http2" | "https" | "http"
            protocol: "http2",

            // Static server hostname
            // Note: this should be a public facing domain
            hostname: "localhost",

            // Static server port
            port: process.env.STATIC_PORT || 4000,

            // Only applicable when protocol is one of http2 / https
            // https://github.com/indutny/node-spdy#options
            secureSettings: {
                // Provide your own key / cert / ca
                key: fs.readFileSync(path.join(__dirname, "../../../ssl/server.key")),
                cert: fs.readFileSync(path.join(__dirname, "../../../ssl/server.crt")),
                ca: fs.readFileSync(path.join(__dirname, "../../../ssl/server.csr")),

                // If using http2, use the following protocols
                protocols: [
                    "h2",
                    "spdy/3.1",
                    "spdy/3",
                    "spdy/2",
                    "http/1.1",
                    "http/1.0"
                ]
            }
        }
    }
};

module.exports = wildcatConfig;
