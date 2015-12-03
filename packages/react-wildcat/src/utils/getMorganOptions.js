/* istanbul ignore next */
module.exports = function getMorganOptions(logLevel) {
    var skip = null;

    switch (logLevel) {
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
