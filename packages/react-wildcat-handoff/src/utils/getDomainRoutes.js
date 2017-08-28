var parseDomain = require("parse-domain");
var defaultSubdomain = "www";

function getLeadingLeafDomain(subdomain) {
    var leafDomains = subdomain.split(".");
    return leafDomains[0];
}

function mapDomainToAlias(host, domainAliases) {
    if (!domainAliases) {
        return host;
    }

    var resolvedHost = host;

    if (typeof domainAliases === "object") {
        Object.keys(domainAliases).forEach(function withAlias(alias) {
            var possibleHosts = domainAliases[alias];
            if (Array.isArray(possibleHosts)) {
                possibleHosts.forEach(function withPossibleHost(possibleHost) {
                    if (String(host) === String(possibleHost)) {
                        resolvedHost = alias;
                    }
                });
            } else if (typeof possibleHosts === "object") {
                Object.keys(possibleHosts).forEach(function withPossibleHost(
                    possibleHost
                ) {
                    var possibleHostAlias = possibleHosts[possibleHost];
                    if (Array.isArray(possibleHostAlias)) {
                        var currentHost = resolvedHost;
                        possibleHostAlias
                            .filter(function filterHostAlias(hostAlias) {
                                return hostAlias;
                            })
                            .forEach(function withHostAlias(hostAlias) {
                                if (hostAlias.endsWith(resolvedHost)) {
                                    currentHost = alias;
                                }
                            });

                        resolvedHost = currentHost;
                    }
                });
            } else {
                resolvedHost = alias;
            }
        });
    }

    return resolvedHost;
}

function mapSubdomainToAlias(host, domainAliases) {
    var resolvedHost = host;

    if (typeof domainAliases === "object") {
        Object.keys(domainAliases).forEach(function withAlias(alias) {
            var possibleHosts = domainAliases[alias];

            if (Array.isArray(possibleHosts)) {
                possibleHosts.forEach(function withPossibleHost(possibleHost) {
                    if (host.startsWith(possibleHost)) {
                        resolvedHost = alias;
                    }
                });
            } else {
                resolvedHost = mapSubdomainToAlias(host, possibleHosts);
            }
        });
    } else {
        var subdomain = getLeadingLeafDomain(resolvedHost || defaultSubdomain);
        var subdomainAliases = {
            local: defaultSubdomain
        };

        return subdomainAliases[subdomain] || subdomain || defaultSubdomain;
    }

    return getLeadingLeafDomain(resolvedHost) || defaultSubdomain;
}

function getDomainDataFromHost(host, domains) {
    var hostExcludingPort = (host || "").split(":")[0];
    var parsedUrl = parseDomain(host, {
        customTlds: ["dev", "example", "invalid", "localhost", "test"]
    }) || {
        domain: hostExcludingPort,
        subdomain: undefined,
        tld: undefined
    };

    var splitHosts = Array.isArray(host) ? host : host.split(".");

    var finalUrl = splitHosts
        .map(h => {
            if (domains[h]) {
                return splitHosts
                    .map(hh => {
                        if (domains[h][hh]) {
                            var url = {
                                domain: h,
                                subdomain: hh,
                                tld: parsedUrl.tld
                            };
                            return url;
                        }
                        return undefined;
                    })
                    .filter(d => d);
            }
            return undefined;
        })
        .filter(d => d);

    // if (finalUrl[0][0].domain && finalUrl[0][0].subdomain) {
    //     return finalUrl[0][0];
    // }

    var resolvedDomain = mapDomainToAlias(
        finalUrl[0][0].domain,
        domains.domainAliases
    );
    // var resolvedSubdomain = finalUrl[0][0].subdomain
    //     ? mapSubdomainToAlias(host, domains.domainAliases)
    //     : null;

    var url = Object.assign({}, url, {
        domain: resolvedDomain,
        subdomain: url.subdomain || defaultSubdomain
    });

    return url;
}

// function getDomainDataFromHost(host, domains, url) {
//     if (!url) {
//         var hostExcludingPort = (host || "").split(":")[0];
//         var parsedUrl = parseDomain(host, {
//             customTlds: [
//                 "dev",
//                 "example",
//                 "invalid",
//                 "localhost",
//                 "nfl",
//                 "test"
//             ]
//         }) || {
//             domain: hostExcludingPort,
//             subdomain: undefined,
//             tld: undefined
//         };

//         var url = {
//             domain: null,
//             subdomain: null,
//             tld: parsedUrl.tld
//         };
//     }

//     // If there's a ., split the host
//     var splitHosts = Array.isArray(host) ? host : host.split(".");

//     if (splitHosts && splitHosts.length && domains) {
//         var dir = splitHosts[0];
//         console.log("dir", dir);
//         var route = domains[dir];
//         if (!!domains[dir]) {
//             if (url.domain) {
//                 url.subdomain = dir;
//             } else {
//                 url.domain = dir;
//             }
//             console.log("map", url);
//             domains = route;
//         }

//         if (splitHosts.length > 1) {
//             return getDomainDataFromHost(splitHosts.slice(1), domains, url);
//         }
//     }

//     if (!url.subdomain) {
//         url.subdomain = defaultSubdomain;
//     }

//     return url;
// }

function getDomainDataFromHost(host, domains) {
    var hostExcludingPort = (host || "").split(":")[0];

    var url = parseDomain(host, {
        customTlds: ["dev", "example", "invalid", "localhost", "nfl", "test"]
    }) || {
        domain: hostExcludingPort,
        subdomain: undefined,
        tld: undefined
    };

    var resolvedDomain = mapDomainToAlias(url.domain, domains.domainAliases);
    var resolvedSubdomain = url.subdomain
        ? mapSubdomainToAlias(host, domains.domainAliases)
        : null;

    url = Object.assign({}, url, {
        domain: resolvedDomain,
        subdomain: resolvedSubdomain || url.subdomain || defaultSubdomain
    });

    return url;
}

function resolveSubdomain(domains, subdomain) {
    if (domains[subdomain]) {
        return domains[subdomain];
    }

    var possibleSubdomains = Object.keys(domains);

    var partialSubdomainMatch = possibleSubdomains.filter(
        function possibleSubdomain(sub) {
            var leadingLeafDomain = getLeadingLeafDomain(subdomain);
            return leadingLeafDomain.split("-").some(function domainPart(part) {
                return part === sub;
            });
        }
    )[0];

    return domains[partialSubdomainMatch];
}

function completeGetDomainRoutes(resolveOptions, cb) {
    console.log("-- completeGetDomainRoutes:", resolveOptions);
    var headers = resolveOptions.headers;
    var domainRoutes = resolveOptions.domainRoutes;
    var subdomain = resolveOptions.subdomain;

    var domainTarget = domainRoutes.domains || domainRoutes;
    var subdomainResult = resolveSubdomain(domainTarget, subdomain);

    if (typeof subdomainResult !== "function") {
        return cb(null, subdomainResult);
    }

    return subdomainResult(headers, cb);
}

// function thingy(domains: Object) {
//     var testDomain = "lions.clubs.wildcat.nfl.com";
//     var splitDomains = testDomain.split(".");

//     splitDomains.forEach(d => {
//         Object.keys(domains);
//     });
// }

module.exports = function getDomainRoutes(domains, headers, cb) {
    // console.log("----- domains: ", JSON.stringify(domains, null, 4));
    var host = headers.host;
    var url = getDomainDataFromHost(host, domains);

    var domain = url.domain;
    var subdomain = url.subdomain;
    var resolveDomain;

    if (domains[domain]) {
        var resolveOptions = {
            headers: headers,
            subdomain: subdomain,
            host: host
        };

        resolveDomain = domains[domain];

        if (typeof resolveDomain !== "function") {
            resolveOptions.domainRoutes = resolveDomain;
            return completeGetDomainRoutes(resolveOptions, cb);
        }

        return resolveDomain(headers, function getSubDomainRoutes(
            error,
            domainRoutes
        ) {
            if (error) {
                return cb(error);
            }

            resolveOptions.domainRoutes = domainRoutes;
            return completeGetDomainRoutes(resolveOptions, cb);
        });
    }

    resolveDomain = resolveSubdomain(domains, subdomain);

    if (typeof resolveDomain !== "function") {
        return cb(null, resolveDomain);
    }

    return resolveDomain(headers, cb);
};
module.exports.mapDomainToAlias = mapDomainToAlias;
module.exports.mapSubdomainToAlias = mapSubdomainToAlias;

module.exports.completeGetDomainRoutes = completeGetDomainRoutes;
module.exports.getDomainDataFromHost = getDomainDataFromHost;
