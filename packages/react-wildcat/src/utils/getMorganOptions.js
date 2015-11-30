/* istanbul ignore next */
module.exports = function getMorganOptions() {
    const wildcatConfig = require("./getWildcatConfig")();
    const generalSettings = wildcatConfig.generalSettings;

    var skip = null;

    switch (generalSettings.logLevel) {
        case 0:
        case 1:
            skip = (req, res) => res.statusCode < 400;
            break;

        case 2:
            skip = (req, res) => res.statusCode !== 201 && res.statusCode < 400;
            break;

        case 3:
            skip = (req, res) => !req.url.startsWith("/public") || res.statusCode >= 400;
            break;
    }

    return {
        skip
    };
};
