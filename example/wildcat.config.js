const pkg = require("./package.json");
const __DEV__ = (process.env.NODE_ENV === "development");
const __PROD__ = (process.env.NODE_ENV === "production");
const __BUNDLE__ = process.env.COVERAGE !== "e2e";

function getPort(port, defaultPort) {
    if ((typeof port !== "undefined") && !(Number(port))) {
        return false;
    }

    return Number(port) || defaultPort;
}

const excludes = [
    "**/node_modules/**",
    "**/jspm_packages/**",
    "**/test/**",
    "**/Test*",
    "**/*.json"
];

/* istanbul ignore next */
const wildcatConfig = {
    generalSettings: {
        // Grab the config file from package.json
        jspmConfigFile: pkg.configFile || (pkg.jspm || {}).configFile || "config.js",

        // Project name
        name: pkg.name,

        // Project version
        version: pkg.version,

        // Instrument your code with Istanbul.
        coverage: !!(process.env.COVERAGE),

        // Only applicable when coverage is true
        coverageSettings: {
            env: process.env.COVERAGE,

            e2e: {
                instrumentation: {
                    excludes
                },

                reporting: {
                    dir: "coverage/e2e",
                    reports: ["lcov", "html"]
                }
            },

            unit: {
                instrumentation: {
                    excludes
                },

                reporting: {
                    dir: "coverage/unit"
                }
            }
        },

        // level of logging
        // 0 = disable
        // 1 = error
        // 2 = warn
        // 3 = info
        // 4 = debug
        logLevel: process.env.LOG_LEVEL ? Number(process.env.LOG_LEVEL) : 4
    },

    clientSettings: {
        // Path to the entry config file relative to the project root
        entry: "public/main.js",

        hotReload: !__PROD__,

        serviceWorker: __PROD__ && __BUNDLE__,

        // Path to the client renderer. This can be a jspm package or a relative path
        renderHandler: "react-wildcat-handoff/client",

        // The target element id where React will be injected
        reactRootElementID: "content",

        // Enable / disable client-side IndexedDB module caching
        indexedDBModuleCache: __DEV__
    },

    serverSettings: {
        // Path to the entry config file relative to the project root
        entry: "public/main.js",

        hotReload: !__PROD__,

        // Path to the server renderer. This can be a jspm package or a relative path
        renderHandler: "react-wildcat-handoff/server",

        // Directory to save raw binaries (jpg, gif, fonts, etc)
        binDir: "bin",

        // BYO-HTML template
        // htmlTemplate: require("./customHtmlTemplate.js"),

        // Graylog config options for the node server
        // https://www.npmjs.com/package/gelf-pro#configuration
        // graylog: {},

        // Directory to output compiled JavaScript modules
        publicDir: "public",

        // Path to your source JavaScript files
        sourceDir: "src",

        // config options for the app server
        appServer: {
            // One of http2 | https | http
            protocol: "http2",

            hostname: "localhost",

            // App server port
            port: getPort(process.env.PORT, 3000),

            // number to limit the max number of CPU's
            // to spin up on a cluster
            maxClusterCpuCount: 1, // Infinity === as many CPU's as the machine has

            middleware: [
                // EXAMPLE:
                require("./api/sampleServerOnlyApi.js"),
                require("./api/serveFavicon.js"),
                require("./api/serveStatic.js")
            ],

            // A key/value of urls to proxy
            // e.g. /static -> http://example.com/static
            proxies: {
                "/proxy": "http://example.com/proxy"
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

            // One of http2 | https | http
            protocol: "http2",

            hostname: "localhost",

            // Static server port
            port: getPort(process.env.STATIC_PORT, 4000),

            // number to limit the max number of CPU's
            // to spin up on a cluster
            maxClusterCpuCount: Infinity // Infinity === as many CPU's as the machine has

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
