const path = require("path");
const serveStatic = require("koa-static");

module.exports = function(app) {
    const staticFolder = path.resolve(__dirname, "../static");
    app.use(serveStatic(staticFolder));
};
