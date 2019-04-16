var nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "production",
    entry: {
        client: "./src/client.js"
    },
    target: "web",
    devtool: false,
    output: {
        path: `${__dirname}/dist`,
        filename: "[name].js",
        library: "react-wildcat-handoff",
        libraryTarget: "commonjs2"
    },
    externals: [nodeExternals()]
};
