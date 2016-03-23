const chalk = require("chalk");

module.exports = function logCreateSuccess(modulePath) {
    const statusCode = chalk.styles.yellow.open + 201 + chalk.styles.yellow.close;
    const relOut = chalk.styles.grey.open + modulePath.replace(`${root}`, "") + chalk.styles.grey.close;

    return `${statusCode} CREATE ${relOut}`;
};
