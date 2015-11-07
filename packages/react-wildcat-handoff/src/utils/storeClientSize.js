var Cookies = require("cookies-js");
var clientSizeKey = require("./clientSizeKey.js");

function queryClientSize(client) {
    client = client || window;

    return {
        height: client.innerHeight,
        width: client.innerWidth
    };
}

module.exports = function storeClientSize(client) {
    var clientSize = queryClientSize(client);
    var cookieData = [clientSize.width, clientSize.height].join();

    Cookies.set(clientSizeKey, cookieData, {
        secure: true
    });

    return cookieData;
};
