"use strict";

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
    "error": "red",
    "info": "magenta",
    "log": null,
    "meta": "gray",
    "ok": "green",
    "warn": "yellow"
};

const mapLogMethods = {
    "error": "error",
    "info": "info",
    "log": "info",
    "meta": "info",
    "ok": "info",
    "warn": "error"
};

function Logger(id) {
    this.id = id;
    return this;
}

function graylog(args, method) {
    if (!log || !env || env === "development") {
        return;
    }
    return log[mapLogMethods[method] || "info"](chalk.stripColor(args.join(" ")));
}

function addColor(arg, color) {
    return chalk.styles[color].open + arg + chalk.styles[color].close;
}

Object.keys(logMethods).forEach((method) => {
    Logger.prototype[method] = function () {
        const args = Array.prototype.slice.call(arguments); //eslint-disable-line prefer-rest-params
        args.unshift(`${this.id}  ~>`);

        args.forEach((arg, i) => {
            const color = logMethods[method];

            if (typeof arg === "string" && color) {
                args[i] = addColor(arg, color);
            }
        });

        if (console[method]) {
            graylog(args, method);
            console[method].apply(console, args);

            if (method === "error") {
                args
                    .filter(arg => arg instanceof Error && arg.stack)
                    .forEach(arg => {
                        console.error(addColor(`${this.id}  ~> Stack Trace:`, logMethods.error));
                        console.error(addColor(arg.stack, logMethods.error));
                    });
            }

            return true;
        }

        graylog(args);
        console.log.apply(console, args);

        return true;
    };
});

module.exports = Logger;
