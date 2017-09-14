/* eslint-disable react/prefer-es6-class */

const React = require("react");
const Router = require("react-router");
const prefetch = require("react-wildcat-prefetch");
const cookie = require("cookie");
const createReactClass = require("create-react-class");

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

    basic2: {
        header: {
            host: "www.exampleuk.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
    },

    clubs: {
        header: {
            host: "lions.clubs.nfl.com",
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

    external: {
        header: {
            host: "www.aliastoexternal.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
    },

    hostname: {
        header: {
            host: "example",
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

    multiSubdomain: {
        header: {
            host: "www.staging.example.com",
            "user-agent": exports.stubUserAgent
        },
        url: "/"
    },

    multiClubsSubdomain: {
        header: {
            host: "lions.wildcat.clubs.nfl.com",
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

exports.response = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,HEAD,PUT,POST,DELETE",
    vary: "Accept-Encoding",
    "content-type": "text/html; charset=utf-8"
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
    get: key => exports.cookieData.values[key]
};

exports.cookieParserWithAlias = {
    get: key => exports.cookieData.alias[key]
};

exports.wildcatConfig = {
    generalSettings: {
        env: {
            __PROD__: process.env.NODE_ENV === "production"
        },
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
        hotReloader: "react-wildcat-hot-reloader",
        renderType: "renderToString",
        appServer: {
            protocol: "https"
        }
    }
};

exports.wildcatConfigRenderType = Object.assign({}, exports.wildcatConfig, {
    serverSettings: {
        hotReload: true,
        hotReloader: "react-wildcat-hot-reloader",
        renderType: () => "renderToStaticMarkup",
        appServer: {
            protocol: "https"
        }
    }
});

exports.wildcatConfigWithHtmlNotFoundTemplate = Object.assign(
    {},
    exports.wildcatConfig,
    {
        serverSettings: {
            hotReload: true,
            hotReloader: "react-wildcat-hot-reloader",
            renderType: "renderToString",
            appServer: {
                protocol: "https"
            },
            htmlNotFoundTemplate: () =>
                "<html><h1>Custom 404 Template</h1></html>"
        }
    }
);

exports.wildcatConfigServiceWorkerEnabled = Object.assign(
    {},
    exports.wildcatConfig,
    {
        clientSettings: {
            serviceWorker: true
        }
    }
);
exports.wildcatConfigServiceWorkerDisabled = Object.assign(
    {},
    exports.wildcatConfig,
    {
        clientSettings: {
            serviceWorker: false
        }
    }
);
exports.wildcatConfigServiceWorkerEnabledNoHttps = Object.assign(
    {},
    exports.wildcatConfig,
    {
        clientSettings: {
            serviceWorker: true
        },
        serverSettings: {
            renderType: () => "renderToStaticMarkup",
            appServer: {
                protocol: "http"
            }
        }
    }
);

exports.Application = createReactClass({
    displayName: "Application",
    render: function render() {
        return React.createElement("div");
    }
});

const NotFoundApplication = exports.Application;
NotFoundApplication.routerProps = {status: 404};

const routes = React.createElement(
    Router.Route,
    {
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
);

exports.routes = {
    async: {
        routes: function getRoutes(location, cb) {
            return setTimeout(() => cb(null, routes), 0);
        }
    },
    sync: {
        routes
    }
};

exports.notFoundRoute = {
    routes: React.createElement(Router.Route, {
        path: "/",
        component: NotFoundApplication
    })
};

exports.callbackError = new Error("Fake Error!");

const invalidRoutes = React.createElement(
    Router.Route,
    {
        path: "/",
        getComponent: (location, cb) => {
            return cb(exports.callbackError);
        }
    },
    React.createElement(Router.Redirect, {
        from: "/context.html",
        to: "/"
    })
);

exports.invalidRoutes = {
    async: {
        routes: function getRoutes(location, cb) {
            return setTimeout(() => cb(exports.callbackError), 0);
        }
    },
    sync: {
        routes: invalidRoutes
    }
};

exports.subdomains = {
    async: {
        domains: {
            err: function getERRRoutes(location, cb) {
                return setTimeout(() => cb(exports.callbackError, null), 0);
            },
            www: function getWWWRoutes(location, cb) {
                return setTimeout(() => cb(null, routes), 0);
            }
        }
    },

    sync: {
        domains: {
            www: routes,
            clubs: {
                lions: {
                    routes
                }
            }
        }
    }
};

exports.regexDomains = {
    async: {
        domains: {
            routes: {
                "*lions*(dev|com)": function getRoutes(location, cb) {
                    return setTimeout(() => cb(exports.callbackError), 0);
                },
                "www.example.(dev|com)": function getRoutes(location, cb) {
                    return setTimeout(() => cb(exports.callbackError), 0);
                }
            }
        }
    },

    sync: {
        domains: {
            routes: {
                "*lions*(dev|com)": routes,
                "www.example.(dev|com)": routes
            }
        }
    }
};

exports.unwrappedSubdomains = {
    async: {
        err: function getERRRoutes(location, cb) {
            return setTimeout(() => cb(exports.callbackError, null), 0);
        },
        www: function getWWWRoutes(location, cb) {
            return setTimeout(() => cb(null, routes), 0);
        }
    },

    sync: {
        www: routes
    }
};

exports.domainAliases = {
    example: {
        www: ["localhost", "example", "www.example", "127.0.0.1"],
        dev: "127.0.0.2"
    }
};

exports.domainAliasesMultiple = {
    internal: {
        foo: ["www.aliastointernal", "www.otheraliastointernal"]
    },
    example: {
        www: ["127.0.0.1"]
    },
    external: {
        test: ["www.aliastoexternal"]
    }
};

exports.domainAliasesNoSubdomain = {
    example: ["localhost", "127.0.0.1", "example"],
    dev: ["test.com", "127.0.0.2"]
};

exports.domainAliasesUndefined = {
    example: {
        www: [undefined]
    }
};

exports.domainAliasesStringOnly = {
    example: "127.0.0.1"
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
    },

    domainAliasesUndefined: {
        domains: {
            domainAliases: exports.domainAliasesUndefined,
            example: exports.subdomains.sync
        }
    },

    domainAliasesStringOnly: {
        domains: {
            domainAliases: exports.domainAliasesStringOnly,
            example: exports.subdomains.sync,
            external: {
                test: routes
            }
        }
    }
};

exports.domainsWithMultipleAliases = {
    async: {
        domains: {
            domainAliases: exports.domainAliasesMultiple,
            example: function getExampleRoutes(location, cb) {
                return setTimeout(() => cb(null, exports.subdomains.async), 0);
            },
            external: function getExternalRoutes(location, cb) {
                return setTimeout(
                    () =>
                        cb(null, {
                            domains: {
                                test: function getWWWRoutes(location2, cb2) {
                                    return setTimeout(
                                        () => cb2(null, routes),
                                        0
                                    );
                                }
                            }
                        }),
                    0
                );
            }
        }
    },

    sync: {
        domains: {
            domainAliases: exports.domainAliasesMultiple,
            example: exports.subdomains.sync,
            clubs: {
                lions: routes
            },
            external: {
                test: routes
            }
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
                return setTimeout(
                    () => cb(null, exports.unwrappedSubdomains.async),
                    0
                );
            },

            localhost: function getUnwrappedLocalhostRoutes(location, cb) {
                return setTimeout(
                    () => cb(null, exports.unwrappedSubdomains.async),
                    0
                );
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
    stub: true
};

exports.fetchPromise = () => Promise.resolve(exports.prefetchedData);

exports.PrefetchedApplication = prefetch(exports.fetchPromise, {
    key: exports.prefetchedDataKey
})(exports.Application);

exports.prefetchedRoutes = {
    routes: React.createElement(Router.Route, {
        path: "/",
        component: exports.PrefetchedApplication
    })
};

exports.developmentPayload = `System.import("react-wildcat-hot-reloader")`;
exports.hydratedPayload = `__INITIAL_DATA__ = {"${exports.prefetchedDataKey}":${JSON.stringify(
    exports.prefetchedData
)}};`;
exports.serviceWorkerPayload = `<script src="/register-sw.js">`;

exports.__REACT_ROOT_ID__ = "__REACT_ROOT_ID__";
