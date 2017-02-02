module.exports = function renderReactWithWebpack(root, options) {
    const path = require("path");
    const clearRequire = require("clear-require");

    const {
        logger,
        wildcatConfig
    } = options;

    const {
        generalSettings: {
            jspmConfigFile,
            staticUrl
        },
        serverSettings: {
            displayBlueBoxOfDeath,
            entry,
            hotReload,
            hotReloader,
            hotReloadReporter,
            renderHandler
        }
    } = wildcatConfig;

    function pageHandler(request, cookies) {
        try {
            clearRequire.all();

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
