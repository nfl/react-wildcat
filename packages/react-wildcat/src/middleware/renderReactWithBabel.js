module.exports = function renderReactWithBabel(root, options) {
    const path = require("path");
    const clearRequire = require("clear-require");
    const hotReloaderWebSocket = require("../utils/hotReloaderWebSocket");

    require("babel-register")({
        plugins: [
            [require.resolve("babel-plugin-transform-async-loader"), {
                "node": true
            }],
            require.resolve("babel-plugin-dynamic-import-node")
        ],
        presets: [
            [require.resolve("babel-preset-env"), {
                "targets": {
                    "node": 6.9
                },
                "modules": "commonjs",
                "useBuiltIns": true
            }]
        ]
    });

    require("asset-require-hook")({
        "extensions": ["css", "png", "jpg", "jpeg", "gif", "svg"],
        "name": "[name].[ext]?[sha512:hash:base64:7]"
    });

    require("babel-polyfill");

    const {
        logger,
        wildcatConfig
    } = options;

    const {
        generalSettings: {
            staticUrl
        },
        serverSettings: {
            displayBlueBoxOfDeath,
            entry,
            hotReload,
            renderHandler
        }
    } = wildcatConfig;

    if (hotReload) {
        hotReloaderWebSocket({
            onFileChanged() {
                clearRequire.all();
            }
        }, staticUrl.replace("http", "ws"), logger);
    }

    function pageHandler(request, cookies) {
        try {
            // Load the server files from the current file system
            const serverOptions = (typeof entry === "string") ? require(path.resolve(root, entry)) : entry;
            const server = require(renderHandler);

            const render = server(serverOptions.default || serverOptions);
            const reply = render(request, cookies, wildcatConfig);

            return {
                // Return the original reply
                reply
            };
        } catch (err) {
            logger.error(err);

            if (displayBlueBoxOfDeath) {
                const blueBoxOfDeath = require("../utils/blueBoxOfDeath");

                return {
                    reply: {
                        error: blueBoxOfDeath(err, request),
                        status: 500
                    }
                };
            }

            return {
                reply: {
                    error: err.stack,
                    status: 500
                }
            };
        }
    }

    return function* render() {
        const {
            cookies,
            request,
            response
        } = this;

        response.status = 200;
        response.type = "text/html";

        const data = yield pageHandler(request, cookies);
        const {
            reply
        } = data;

        this.status = reply.status || response.status;

        if (reply.redirect === true) {
            const {
                redirectLocation
            } = reply;
            return this.redirect(`${redirectLocation.pathname}${redirectLocation.search}`);
        }

        if (reply.error) {
            return this.body = reply.error;
        }

        return this.body = reply.html;
    };
};
