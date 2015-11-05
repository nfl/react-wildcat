const React = require("react");
const Router = require("react-router");
const prefetch = require("react-wildcat-prefetch");

exports.requests = {
    basic: {
        header: {
            host: "www.example.com"
        },
        url: "/"
    },

    err: {
        header: {
            host: "err.example.com"
        },
        url: "/"
    },

    invalid: {
        header: {
            host: "www.example.com"
        },
        url: "/this-route-does-not-exist"
    },

    noSubdomain: {
        header: {
            host: "example.com"
        },
        url: "/"
    },

    redirect: {
        header: {
            host: "www.example.com"
        },
        url: "/redirect"
    }
};

exports.cookies = {
    get: () => {}
};

exports.wildcatConfig = {
    generalSettings: {
        staticUrl: "https://localhost:4000"
    },
    clientSettings: {
        entry: "public/main.js",
        reactRootElementID: "content",
        renderHandler: "react-wildcat-handoff/client"
    },
    serverSettings: {}
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
        })
    )
};

exports.callbackError = "Fake Error!";

exports.invalidRoutes = {
    routes: React.createElement(
        Router.Route, {
            path: "/",
            getComponent: (location, cb) => {
                return cb(exports.callbackError);
            }
        }
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
            }
        }
    },

    sync: {
        domains: {
            example: exports.subdomains.sync
        }
    }
};

exports.unwrappedDomains = {
    async: {
        domains: {
            example: function getExampleRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.unwrappedSubdomains.async), 0);
            }
        }
    },

    sync: {
        domains: {
            example: exports.unwrappedSubdomains.sync
        }
    }
};

exports.invalidDomains = {
    async: {
        domains: {
            example: function getExampleRoutes(location, cb) {
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

exports.developmentPayload = `var socket = new WebSocket("${exports.wildcatConfig.generalSettings.staticUrl.replace("http", "ws")}");`;
exports.hydratedPayload = `__INITIAL_DATA__ = {"${exports.prefetchedDataKey}":${JSON.stringify(exports.prefetchedData)}};`;