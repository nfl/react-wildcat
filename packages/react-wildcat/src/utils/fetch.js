"use strict";

var realFetch = require("node-fetch");

module.exports = function (url, options) {
    if (/^\/\//.test(url)) {
        url = "https:" + url;
    }
    return realFetch.call(this, url, options);
};

/* istanbul ignore else */
if (typeof global !== "undefined" && !global.fetch) {
    global.fetch = module.exports;
}
