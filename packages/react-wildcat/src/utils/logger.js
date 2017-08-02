const chalk = require("chalk");
const wildcatConfig = require("./getWildcatConfig")();
const serverSettings = wildcatConfig.serverSettings;

let log, env;

if (serverSettings.graylog) {
    env = serverSettings.graylog.fields.env;
    log = require("gelf-pro");
    log.setConfig(serverSettings.graylog);
}

const logMethods = {
    error: "red",
    info: "magenta",
    log: null,
    meta: "gray",
    ok: "green",
    warn: "yellow"
};

const mapLogMethods = {
    error: "error",
    info: "info",
    log: "info",
    meta: "info",
    ok: "info",
    warn: "error"
};

function Logger(id) {
    this.id = id;
    return this;
}

function graylog(args, method) {
    if (!log || !env || env === "development") {
        return false;
    }

    return log[mapLogMethods[method] || "info"](
        chalk.stripColor(args.join(" "))
    );
}

function addColor(arg, method) {
    const color = logMethods[method];

    if (typeof arg !== "string" || !color) {
        return arg;
    }

    return chalk.styles[color].open + arg + chalk.styles[color].close;
}

Object.keys(logMethods).forEach(method => {
    Logger.prototype[method] = function(...args) {
        args.unshift(`${this.id}  ~>`);
        args = args.map(arg => addColor(arg, method));

        if (console[method]) {
            graylog(args, method);
            console[method](...args);

            if (method === "error") {
                args
                    .filter(arg => arg instanceof Error && arg.stack)
                    .forEach(arg => {
                        console.error(
                            addColor(`${this.id}  ~> Stack Trace:`, method)
                        );
                        console.error(addColor(arg.stack, method));
                    });
            }

            return true;
        }

        graylog(args);
        console.log(...args);

        return true;
    };
});

module.exports = Logger;
