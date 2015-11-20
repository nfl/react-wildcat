"use strict";

const simpleRender = require("./utils/simpleRender.js");

function render(cfg) {
    return function simpleHandoff(request, cookies, wildcatConfig) {
        cfg = Object.assign({}, cfg, {
            wildcatConfig
        });

        return simpleRender(cfg);
    };
}

module.exports = function simple(cfg) {
    return render(cfg);
};
