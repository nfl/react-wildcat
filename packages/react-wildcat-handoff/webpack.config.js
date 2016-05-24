var nodeExternals = require("webpack-node-externals");

module.exports = {
    debug: false,
    entry: {
        client: "./src/client.js"
    },
    target: "web",
    devtool: false,
    output: {
        path: "./dist",
        filename: "[name].js",
        library: "react-wildcat-handoff",
        libraryTarget: "commonjs2"
    },
    resolve: {
        modulesDirectories: [
            "node_modules"
        ]
    },
    externals: [nodeExternals({
        whitelist: ["parse-domain"]
    })]
};
