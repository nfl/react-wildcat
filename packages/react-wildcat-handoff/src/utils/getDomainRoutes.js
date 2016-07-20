var parseDomain = require("parse-domain");
var defaultSubdomain = "www";

function getLeadingLeafDomain(subdomain) {
    var leafDomains = subdomain.split(".");
    return leafDomains[0];
}

function mapDomainToAlias(host, domainAliases) {
    var resolvedHost = host;

    if (typeof domainAliases === "object") {
        Object.keys(domainAliases)
            .forEach(function withAlias(alias) {
                var possibleHosts = domainAliases[alias];

                if (Array.isArray(possibleHosts)) {
                    possibleHosts.forEach(function withPossibleHost(possibleHost) {
                        if (host.startsWith(possibleHost)) {
                            resolvedHost = alias;
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
        Object.keys(domainAliases)
            .forEach(function withAlias(alias) {
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
        var subdomain = getLeadingLeafDomain(host || defaultSubdomain);
        var subdomainAliases = {
            "local": defaultSubdomain
        };
        return subdomainAliases[subdomain];
    }

    return getLeadingLeafDomain(resolvedHost);
}

function getDomainDataFromHost(host, domains) {
    var hostExcludingPort = (host || "").split(":")[0];
    var resolvedSubdomain = mapSubdomainToAlias(host, domains.domainAliases);

    var url = parseDomain(host, {
        // https://iyware.com/dont-use-dev-for-development/
        customTlds: [
            "example",
            "invalid",
            "localhost",
            "test"
        ]
    }) || {
        domain: hostExcludingPort,
        subdomain: resolvedSubdomain,
        tld: undefined
    };

    var resolvedDomain = mapDomainToAlias(url.domain, domains.domainAliases);
    url.domain = resolvedDomain;
    return url;
}

function resolveSubdomain(domains, subdomain) {
    if (domains[subdomain]) {
        return domains[subdomain];
    }

    var possibleSubdomains = Object.keys(domains);

    var partialSubdomainMatch = possibleSubdomains.filter(function possibleSubdomain(sub) {
        return subdomain.split("-").some(function domainPart(part) {
            return part === sub;
        });
    })[0];

    return domains[partialSubdomainMatch];
}

function completeGetDomainRoutes(resolveOptions, cb) {
    var host = resolveOptions.host;
    var domainRoutes = resolveOptions.domainRoutes;
    var subdomain = resolveOptions.subdomain;

    var domainTarget = domainRoutes.domains || domainRoutes;
    var subdomainResult = resolveSubdomain(domainTarget, subdomain);

    if (typeof subdomainResult !== "function") {
        return cb(null, subdomainResult);
    }

    return subdomainResult(host, cb);
}

module.exports = function getDomainRoutes(domains, headers, cb) {
    var host = headers.host;
    var url = getDomainDataFromHost(host, domains);

    var domain = url.domain;
    var subdomain = url.subdomain;
    var resolveDomain;

    if (domains[domain]) {
        var resolveOptions = {
            subdomain: subdomain,
            host: host
        };

        resolveDomain = domains[domain];

        if (typeof resolveDomain !== "function") {
            resolveOptions.domainRoutes = resolveDomain;
            return completeGetDomainRoutes(resolveOptions, cb);
        }

        return resolveDomain(host, function getSubDomainRoutes(error, domainRoutes) {
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

    return resolveDomain(host, cb);
};
