const chalk = require("chalk");

module.exports = function getMorganOptions(logLevel, serverSettings) {
    let skip = null;
    let logger, env;

    if (serverSettings && serverSettings.graylog) {
        env = serverSettings.graylog.fields.env;
        logger = require("gelf-pro");
        logger.setConfig(serverSettings.graylog);
    }

    switch (logLevel) {
        case 0:
        case 1:
            skip = (req, res) => res.statusCode < 400;
            break;

        case 2:
            skip = (req, res) => res.statusCode !== 201 && res.statusCode < 400;
            break;

        case 3:
            skip = (req, res) =>
                !req.url.startsWith("/public") || res.statusCode >= 400;
            break;
    }

    let graylogData;

    const graylog = (req, res) => {
        if (logger && env) {
            graylogData = {
                HTTP_host: req.headers.host,
                HTTP_method: req.method,
                HTTP_response_code: res.statusCode,
                HTTP_URI: req.url
            };
        }

        return skip && skip(req, res);
    };

    return {
        skip: graylog,
        stream: {
            write: data => {
                if (logger && env) {
                    logger.debug(chalk.stripColor(data), graylogData);
                }

                return process.stdout.write(data);
            }
        }
    };
};
