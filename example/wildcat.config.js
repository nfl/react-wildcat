const fs = require("fs");
const path = require("path");

const pkg = require("./package.json");
const __PROD__ = (process.env.NODE_ENV === "production");
const __TEST__ = (process.env.BABEL_ENV === "test");

function getDefaultSSLFile(filename) {
    const filePath = process.env.HOST === "localhost" || !process.env.HOST ? "../packages/react-wildcat/ssl/server." : "ssl/example.";
    return fs.readFileSync(path.join(__dirname, `${filePath}${filename}`), "utf8");
}

const defaultServerKey = getDefaultSSLFile("key");
const defaultServerCert = getDefaultSSLFile("crt");
const defaultServerCA = getDefaultSSLFile("csr");

function getPort(port, defaultPort) {
    if ((typeof port !== "undefined") && !(Number(port))) {
        return false;
    }

    return Number(port) || defaultPort;
}

const excludes = [
    "**/node_modules/**",
    "**/test/**",
    "**/Test*",
    "**/*.json"
];

/* istanbul ignore next */
const wildcatConfig = {
    generalSettings: {
        seleniumAddress: process.env.HOST === "localhost" || !process.env.HOST ? null : "http://selenium:4444/wd/hub",

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
        hotReload: !__PROD__,

        serviceWorker: process.env.SERVICE_WORKERS || (__PROD__ && !__TEST__),

        webpackDevSettings: require("./config/webpack/development.client.config.js")
    },

    serverSettings: {
        // Path to the entry config file relative to the project root
        entry: "public/server.js",

        hotReload: !__PROD__,

        // BYO-HTML template
        // htmlTemplate: require("./customHtmlTemplate.js"),

        // Graylog config options for the node server
        // https://www.npmjs.com/package/gelf-pro#configuration
        // graylog: {},

        // Directory to output compiled JavaScript modules
        publicDir: "public",

        // Path to your source JavaScript files
        sourceDir: "src",

        webpackDevSettings: require("./config/webpack/development.server.config.js"),

        // config options for the app server
        appServer: {
            // One of http2 | https | http
            protocol: "http2",

            hostname: process.env.HOST || "localhost",

            // App server port
            port: getPort(process.env.PORT, 3000),

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
            },

            // Only applicable when one of http2/https is true
            // https://github.com/indutny/node-spdy#options
            // Only applicable when one of http2/https is true
            // https://github.com/indutny/node-spdy#options
            secureSettings: {
                // Provide your own key / cert / ca
                key: defaultServerKey,
                cert: defaultServerCert,
                ca: defaultServerCA
            }
        },

        // config options for the static server
        staticServer: {
            // An array of domains to allow for cross-origin requests
            corsOrigins: [
                "localhost",
                "www.example.dev",
                "example.dev"
            ],

            // One of http2 | https | http
            protocol: "http2",

            hostname: process.env.STATIC_HOST || "localhost",

            // Static server port
            port: getPort(process.env.STATIC_PORT, 4000),

            // Only applicable when one of http2/https is true
            // https://github.com/indutny/node-spdy#options
            // Only applicable when one of http2/https is true
            // https://github.com/indutny/node-spdy#options
            secureSettings: {
                // Provide your own key / cert / ca
                key: defaultServerKey,
                cert: defaultServerCert,
                ca: defaultServerCA
            }
        }
    }
};

module.exports = wildcatConfig;
