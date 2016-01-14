const React = require("react");
const Router = require("react-router");
const prefetch = require("react-wildcat-prefetch");

exports.stubUserAgent = "Mozilla/5.0";

exports.requests = {
    basic: {
        header: {
            host: "www.example.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
    },

    err: {
        header: {
            host: "err.example.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
    },

    invalid: {
        header: {
            host: "www.example.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/this-route-does-not-exist"
    },

    noSubdomain: {
        header: {
            host: "example.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
    },

    redirect: {
        header: {
            host: "www.example.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/redirect"
    }
};

exports.cookieData = {
    alias: {
        clientSize: "desktop"
    },

    values: {
        clientSize: "1024,768"
    }
};

exports.clientSize = {
    alias: {
        height: undefined,
        width: "992"
    },

    values: {
        height: "768",
        width: "1024"
    }
};

exports.cookieParser = {
    get: () => {}
};

exports.cookieParserWithValues = {
    get: (key) => exports.cookieData.values[key]
};

exports.cookieParserWithAlias = {
    get: (key) => exports.cookieData.alias[key]
};

exports.wildcatConfig = {
    generalSettings: {
        staticUrl: "https://localhost:4000"
    },
    clientSettings: {
        entry: "public/main.js",
        hotReload: true,
        hotReloader: "react-wildcat-hot-reloader",
        reactRootElementID: "content",
        renderHandler: "react-wildcat-handoff/client"
    },
    serverSettings: {
        hotReload: true,
        hotReloader: "react-wildcat-hot-reloader"
    }
};

exports.Application = React.createClass({
    displayName: "Application",
    render: function render() {
        return React.createElement("div");
    }
});

exports.routes = {
    routes: React.createElement(
        Router.Route, {
            path: "/",
            component: exports.Application
        },

        React.createElement(Router.Redirect, {
            from: "/redirect",
            to: "/"
        }),

        React.createElement(Router.Redirect, {
            from: "/context.html",
            to: "/"
        })
    )
};

exports.callbackError = new Error("Fake Error!");

exports.invalidRoutes = {
    routes: React.createElement(
        Router.Route, {
            path: "/",
            getComponent: (location, cb) => {
                return cb(exports.callbackError);
            }
        },

        React.createElement(Router.Redirect, {
            from: "/context.html",
            to: "/"
        })
    )
};

exports.subdomains = {
    async: {
        domains: {
            err: function getERRRoutes(location, cb) {
                return setTimeout(() => cb(exports.callbackError, null), 0);
            },
            www: function getWWWRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.routes.routes), 0);
            }
        }
    },

    sync: {
        domains: {
            www: exports.routes.routes
        }
    }
};

exports.unwrappedSubdomains = {
    async: {
        err: function getERRRoutes(location, cb) {
            return setTimeout(() => cb(exports.callbackError, null), 0);
        },
        www: function getWWWRoutes(location, cb) {
            return setTimeout(() => cb(null, exports.routes.routes), 0);
        }
    },

    sync: {
        www: exports.routes.routes
    }
};

exports.domains = {
    async: {
        domains: {
            example: function getExampleRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.subdomains.async), 0);
            },

            localhost: function getLocalhostRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.subdomains.async), 0);
            }
        }
    },

    sync: {
        domains: {
            example: exports.subdomains.sync,
            localhost: exports.subdomains.sync
        }
    }
};

exports.unwrappedDomains = {
    async: {
        domains: {
            example: function getUnwrappedExampleRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.unwrappedSubdomains.async), 0);
            },

            localhost: function getUnwrappedLocalhostRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.unwrappedSubdomains.async), 0);
            }
        }
    },

    sync: {
        domains: {
            example: exports.unwrappedSubdomains.sync,
            localhost: exports.unwrappedSubdomains.sync
        }
    }
};

exports.invalidDomains = {
    async: {
        domains: {
            example: function getInvalidExampleRoutes(location, cb) {
                return setTimeout(() => cb(exports.callbackError, null), 0);
            },

            localhost: function getInvalidLocalhostRoutes(location, cb) {
                return setTimeout(() => cb(exports.callbackError, null), 0);
            }
        }
    }
};

exports.prefetchedDataKey = "stubData";

exports.prefetchedData = {
    "stub": true
};

exports.fetchPromise = () => Promise.resolve(exports.prefetchedData);

exports.PrefetchedApplication = prefetch(exports.fetchPromise, {
    key: exports.prefetchedDataKey
})(exports.Application);

exports.prefetchedRoutes = {
    routes: React.createElement(
        Router.Route, {
            path: "/",
            component: exports.PrefetchedApplication
        }
    )
};

exports.developmentPayload = `System.import("react-wildcat-hot-reloader")`;
exports.hydratedPayload = `__INITIAL_DATA__ = {"${exports.prefetchedDataKey}":${JSON.stringify(exports.prefetchedData)}};`;

exports.__REACT_ROOT_ID__ = "__REACT_ROOT_ID__";
