module.exports = function getWildcatConfig(cwd = process.cwd()) {
    const fs = require("fs-extra");
    const url = require("url");
    const path = require("path");
    const merge = require("deepmerge");

    const defaultConfig = require("../config/wildcat.config.js");
    const projectConfigFile = path.join(cwd, "wildcat.config.js");

    let wildcatConfig = defaultConfig;

    if (fs.existsSync(projectConfigFile)) {
        wildcatConfig = merge(defaultConfig, require(projectConfigFile));
    }

    const {
        serverSettings: {
            appServer: appServerSettings,
            staticServer: staticServerSettings
        }
    } = wildcatConfig;

    // Add some convenience aliases
    wildcatConfig = merge({
        generalSettings: {
            originUrl: url.format({
                protocol: appServerSettings.protocol.replace("http2", "https"),
                hostname: appServerSettings.hostname,
                port: appServerSettings.port
            }),
            staticUrl: url.format({
                protocol: staticServerSettings.protocol.replace("http2", "https"),
                hostname: staticServerSettings.hostname,
                port: staticServerSettings.port
            })
        }
    }, wildcatConfig);

    return wildcatConfig;
};
