/* eslint-disable react/prefer-es6-class */

const React = require("react");
const Router = require("react-router");
const prefetch = require("react-wildcat-prefetch");
const cookie = require("cookie");

exports.stubUserAgent = "Mozilla/5.0";
exports.rawCookie = "FOO=1; BAR=2";

exports.requests = {
    basic: {
        header: {
            host: "www.example.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
    },

    ephemeral: {
        header: {
            host: "www-staging.example.com",
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

    invalidSubdomain: {
        header: {
            host: "wwwstaging.example.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
    },

    ip: {
        header: {
            host: "127.0.0.1",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
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

exports.headers = {
    basic: {
        cookies: cookie.parse(exports.rawCookie),
        host: "www.example.com",
        referrer: "www.google.com",
        "user-agent": exports.stubUserAgent
    },

    ephemeral: {
        cookies: cookie.parse(""),
        host: "www-staging.example.com",
        referrer: null,
        "user-agent": exports.stubUserAgent
    },

    err: {
        cookies: cookie.parse(""),
        host: "err.example.com",
        referrer: null,
        "user-agent": exports.stubUserAgent
    },

    invalid: {
        cookies: cookie.parse(""),
        host: "www.example.com",
        referrer: null,
        "user-agent": exports.stubUserAgent
    },

    invalidSubdomain: {
        cookies: cookie.parse(""),
        host: "wwwstaging.example.com",
        referrer: null,
        "user-agent": exports.stubUserAgent
    },

    noSubdomain: {
        cookies: cookie.parse(""),
        host: "example.com",
        referrer: null,
        "user-agent": exports.stubUserAgent
    },

    redirect: {
        cookies: cookie.parse(exports.rawCookie),
        host: "www.example.com",
        referrer: "www.google.com",
        "user-agent": exports.stubUserAgent
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
        staticUrl: "https://static.example.localhost:4000"
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
        hotReloader: "react-wildcat-hot-reloader",
        renderType: "renderToString"
    }
};

exports.wildcatConfigRenderType = Object.assign({}, exports.wildcatConfig, {
    serverSettings: {
        hotReload: true,
        hotReloader: "react-wildcat-hot-reloader",
        renderType: () => "renderToStaticMarkup"
    }
});

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

exports.domainAliases = {
    "example": {
        "www": [
            "localhost",
            "example",
            "127.0.0.1"
        ],
        "dev": [
            "127.0.0.2"
        ]
    }
};

exports.domainAliasesNoSubdomain = {
    "example": [
        "localhost",
        "127.0.0.1",
        "example"
    ],
    "dev": [
        "test.com",
        "127.0.0.2"
    ]
};

exports.domains = {
    async: {
        domains: {
            domainAliases: exports.domainAliases,

            example: function getExampleRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.subdomains.async), 0);
            }
        }
    },

    sync: {
        domains: {
            domainAliases: exports.domainAliases,
            example: exports.subdomains.sync
        }
    }
};

exports.domainsWithoutAliasedSubdomains = {
    async: {
        domains: {
            domainAliases: exports.domainAliasesNoSubdomain,

            example: function getExampleRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.subdomains.async), 0);
            }
        }
    },

    sync: {
        domains: {
            domainAliases: exports.domainAliasesNoSubdomain,
            example: exports.subdomains.sync
        }
    }
};

exports.unwrappedDomains = {
    async: {
        domains: {
            domainAliases: exports.domainAliases,

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
            domainAliases: exports.domainAliases,

            example: exports.unwrappedSubdomains.sync,
            localhost: exports.unwrappedSubdomains.sync
        }
    }
};

exports.invalidDomains = {
    async: {
        domains: {
            domainAliases: exports.domainAliases,

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
