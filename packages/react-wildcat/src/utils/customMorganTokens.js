module.exports = function customMorganTokens(morgan, id) {
    const chalk = require("chalk");

    morgan.token("id", function getIdToken() {
        return `${chalk.styles.gray.open}${id}  ~>${chalk.styles.gray.close}`;
    });

    morgan.token("status", function getStatusToken(req, res) {
        let statusColor = "cyan";
        const statusCode = res.statusCode;

        if (statusCode >= 300 && statusCode < 400) {
            statusColor = "magenta";
        }

        if (statusCode >= 400) {
            statusColor = "red";
        }

        return (
            chalk.styles[statusColor].open +
            statusCode +
            chalk.styles[statusColor].close
        );
    });

    morgan.token("url", function getUrlToken(req) {
        return (
            chalk.styles.gray.open +
            (req.originalUrl || req.url) +
            chalk.styles.gray.close
        );
    });

    return morgan;
};
