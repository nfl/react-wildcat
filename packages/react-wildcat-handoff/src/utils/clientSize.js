var Cookies = require("cookies-js");
var clientSizeKey = "clientSize";
var mediaQueryAliases = {
    mobile: {
        height: undefined,
        width: 300
    },
    tablet: {
        height: undefined,
        width: 768
    },
    desktop: {
        height: undefined,
        width: 992
    }
};

function queryClientSize(client) {
    client = client || window;

    return {
        height: client.innerHeight,
        width: client.innerWidth
    };
}

function parseClientSizeFromString(string) {
    string = string || "";
    var clientSize = decodeURIComponent(string).split(",");

    return {
        height: clientSize[1],
        width: clientSize[0]
    };
}

exports.getClientSize = function getClientSize(cookieParser, query) {
    cookieParser = cookieParser || Cookies;
    query = query || {};

    var storedClientSize = cookieParser.get(clientSizeKey);

    if (storedClientSize) {
        return parseClientSizeFromString(storedClientSize);
    }


    if (query[clientSizeKey]) {
        var size = query[clientSizeKey];
        return mediaQueryAliases[size] || parseClientSizeFromString(size);
    }

    return {};
};

exports.storeClientSize = function storeClientSize(client) {
    var clientSize = queryClientSize(client);

    Cookies.set(clientSizeKey, `${clientSize.width},${clientSize.height}`, {
        secure: true
    });
};
