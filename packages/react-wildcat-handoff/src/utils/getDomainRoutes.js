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

    var url = parseDomain(host, {
        customTlds: ["dev", "example", "invalid", "localhost", "test"]
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

module.exports = function getDomainRoutes(domains, headers, cb) {
    if (domains.routes) {
        return getRegexDomainRoutes(domains.routes, headers, cb);
    }

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

function getRegexDomainRoutes(domains, headers, cb) {
    var resolveDomain = Object.keys(domains)
        .map(domain => {
            var hostExcludingPort = (headers.host || "").split(":")[0];

            try {
                var domainRegex = new RegExp(domain, "g");
            } catch (err) {
                console.error("Invalid Regex: ", domain, err);
                return undefined;
            }

            if (domainRegex && domainRegex.test(hostExcludingPort)) {
                return domains[domain];
            }
            return undefined;
        })
        .filter(d => d)[0];

    if (typeof resolveDomain !== "function") {
        return cb(null, resolveDomain);
    }

    return resolveDomain(headers, cb);
}

module.exports.mapDomainToAlias = mapDomainToAlias;
module.exports.mapSubdomainToAlias = mapSubdomainToAlias;
