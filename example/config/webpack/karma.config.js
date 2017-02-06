const {
    resolve
} = require("./base.config.js");

module.exports = {
    cache: true,
    target: "web",
    devtool: "inline-source-map",

    // webpack configuration
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /lib|node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true
                        }
                    }
                ]
            },
            {
                test: /\.(css|png|jpg|jpeg|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader"
                    }
                ]
            }
        ]
    },
    resolve
};
