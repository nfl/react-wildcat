"use strict";

const defaultTemplate = require("./defaultTemplate.js");

module.exports = function serverRender(cfg) {
    let result = {};

    const wildcatConfig = cfg.wildcatConfig;
    const htmlTemplate = wildcatConfig.serverSettings.htmlTemplate || defaultTemplate;

    const html = htmlTemplate({
        data: {},
        head: {
            htmlAttributes: {
                toString: () => ""
            },
            link: {
                toString: () => ""
            },
            meta: {
                toString: () => ""
            },
            title: {
                toString: () => ""
            }
        },
        html: "",
        wildcatConfig
    });

    result = Object.assign({}, result, {
        html: html
    });

    return Promise.resolve(result);
};
