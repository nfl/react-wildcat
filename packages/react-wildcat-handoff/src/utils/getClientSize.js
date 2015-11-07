var Cookies = require("cookies-js");
var clientSizeKey = require("./clientSizeKey.js");
var mediaQueryAliases = {
    mobile: {
        height: undefined,
        width: "300"
    },
    tablet: {
        height: undefined,
        width: "768"
    },
    desktop: {
        height: undefined,
        width: "992"
    }
};

function parseClientSizeFromString(string) {
    var clientSize = decodeURIComponent(string).split(",");

    return {
        height: clientSize[1],
        width: clientSize[0]
    };
}

module.exports = function getClientSize(cookieParser, query) {
    cookieParser = cookieParser || Cookies;
    query = query || {};

    var storedClientSize = cookieParser.get(clientSizeKey);

    if (storedClientSize) {
        return mediaQueryAliases[storedClientSize] || parseClientSizeFromString(storedClientSize);
    }

    if (query[clientSizeKey]) {
        var size = query[clientSizeKey];
        return mediaQueryAliases[size] || parseClientSizeFromString(size);
    }

    return {};
};
