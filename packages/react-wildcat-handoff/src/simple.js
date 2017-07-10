const simpleRender = require("./utils/simpleRender.js");

function render(cfg) {
    return function simpleHandoff(request, response, cookies, wildcatConfig) {
        cfg = Object.assign({}, cfg, {
            request,
            response,
            wildcatConfig
        });

        return simpleRender(cfg);
    };
}

module.exports = function simple(cfg) {
    return render(cfg);
};
