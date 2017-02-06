const simpleRender = require("./utils/simpleRender.js");

function render(cfg) {
    return function simpleHandoff(request, cookies, wildcatConfig) {
        cfg = Object.assign({}, cfg, {
            request,
            wildcatConfig
        });

        return simpleRender(cfg);
    };
}

module.exports = function simple(cfg) {
    return render(cfg);
};
