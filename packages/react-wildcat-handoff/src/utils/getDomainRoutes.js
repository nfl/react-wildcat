var parseDomain = require("parse-domain");

function getLeadingLeafDomain(subdomain) {
    var leafDomains = subdomain.split(".");
    return leafDomains[0];
}

function getDomainDataFromHost(host) {
    var defaultSubdomain = "www";

    var subdomainAliases = {
        "local": defaultSubdomain
    };

    var url = parseDomain(host) || {
        domain: (host || "").split(":")[0],
        subdomain: defaultSubdomain,
        tld: undefined
    };

    var subdomain = getLeadingLeafDomain(url.subdomain || defaultSubdomain);
    var resolvedSubdomain = subdomainAliases[subdomain] || subdomain;

    url.subdomain = resolvedSubdomain;
    return url;
}

function completeGetDomainRoutes(resolveOptions, cb) {
    var domainRoutes = resolveOptions.domainRoutes;
    var subdomain = resolveOptions.subdomain;
    var host = resolveOptions.host;

    var resolveSubdomain = (domainRoutes.domains || domainRoutes)[subdomain];

    if (typeof resolveSubdomain !== "function") {
        return cb(null, resolveSubdomain);
    }

    return resolveSubdomain(host, cb);
}

module.exports = function getDomainRoutes(domains, header, cb) {
    var host = header.host;
    var url = getDomainDataFromHost(host);

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

    resolveDomain = domains[subdomain];

    if (typeof resolveDomain !== "function") {
        return cb(null, resolveDomain);
    }

    return resolveDomain(host, cb);
};
