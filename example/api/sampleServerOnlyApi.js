const route = require("koa-route");

module.exports = function (app, wildcatConfig) {
    console.log("Initializing server-only api...");

    var sampleRoute = route.get("/react-wildcat-server-only-example", function* () {
        this.body = "Hello from the server world!";
    });

    app.use(sampleRoute);
};
