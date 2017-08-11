module.exports = function renderReactWithWebpack(root, options) {
    const path = require("path");

    const blueBoxOfDeath = require("../utils/blueBoxOfDeath");
    const Convert = require("ansi-to-html");
    const convert = new Convert();
    const StackTraceParser = require("stacktrace-parser");

    const {logger, wildcatConfig} = options;

    const {
        generalSettings: {env: {__DEV__}},
        serverSettings: {displayBlueBoxOfDeath, entry, webpackDevSettings}
    } = wildcatConfig;

    const validate = require("../utils/webpackBundleValidation")(root, {
        __DEV__,
        logger,
        webpackDevSettings
    });

    function buildEditorLauncherParams(err) {
        const parsedStackTrace = StackTraceParser.parse(err.stack);
        return {
            file: parsedStackTrace[0].file,
            lineNumber: parsedStackTrace[0].lineNumber
        };
    }

    function pageHandler(request, response, cookies) {
        return new Promise((resolve, reject) => {
            validate.onReady((err, stats) => {
                if (err) {
                    return reject(err);
                }

                if (displayBlueBoxOfDeath && stats && stats.hasErrors()) {
                    return resolve({
                        error: blueBoxOfDeath(
                            stats.compilation.errors.map(e => ({
                                message: convert.toHtml(e.error),
                                id: e.module.id
                            })),
                            request
                        ),
                        status: 500
                    });
                }

                // Load the server files from the current file system
                const render = require(path.resolve(root, entry)).default;
                const reply = render(request, response, cookies, wildcatConfig);

                return resolve(
                    // Return the original reply
                    reply
                );
            });
        }).catch(err => {
            logger.error(err);

            if (displayBlueBoxOfDeath) {
                return {
                    reactErrorOverlay: buildEditorLauncherParams(err),
                    error: blueBoxOfDeath(err, request, response),
                    status: 500
                };
            }

            return {
                error: err.stack,
                status: 500
            };
        });
    }

    return function* render() {
        const {cookies, request, response} = this;

        response.status = 200;
        response.type = "text/html";

        const reply = yield pageHandler(request, response, cookies);

        this.status = reply.status;

        this.state.reactErrorOverlay = reply.reactErrorOverlay;

        if (reply.redirect === true) {
            const {redirectLocation} = reply;
            return this.redirect(
                `${redirectLocation.pathname}${redirectLocation.search}`
            );
        }

        if (reply.error) {
            return (this.body = reply.error);
        }

        return (this.body = reply.html);
    };
};
