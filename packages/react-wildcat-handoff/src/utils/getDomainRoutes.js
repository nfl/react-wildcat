var parseDomain = require("parse-domain");

function getDomainDataFromHost(host) {
    var defaultSubdomain = "www";

    var subdomainAliases = {
        "local": defaultSubdomain
    };

    var url = parseDomain(host);
    var subdomain = url.subdomain;
    var resolvedSubdomain = subdomainAliases[subdomain] || subdomain || defaultSubdomain;

    url.subdomain = resolvedSubdomain;

    return url;
}

module.exports = function getDomainRoutes(domains, header, cb) {
    var host = header.host;
    var url = getDomainDataFromHost(host);

    var domain = url.domain;
    var subdomain = url.subdomain;
    var resolveDomain;

    if (domains[domain]) {
        resolveDomain = domains[domain];

        if (typeof resolveDomain !== "function") {
            return cb(null, resolveDomain);
        }

        return resolveDomain(host, function (err, domainRoutes) {
            if (err) {
                throw new Error(err);
            }

            var resolveSubdomain = domainRoutes[subdomain];

            if (typeof resolveSubdomain !== "function") {
                return cb(null, resolveSubdomain);
            }

            return resolveSubdomain(host, cb);
        });
    }

    resolveDomain = domains[subdomain];

    if (typeof resolveDomain !== "function") {
        return cb(null, resolveDomain);
    }

    return resolveDomain(host, cb);
};
