const customWildcatConfig = {
    serverSettings: {
        appServer: {
            protocol: "http",
            hostname: "mytestorigin.com",
            port: false
        },
        staticServer: {
            protocol: "http",
            hostname: "myteststatic.com",
            port: false
        }
    }
};

module.exports = customWildcatConfig;
