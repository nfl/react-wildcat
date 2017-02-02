"use strict";

const defaultTemplate = require("./defaultTemplate.js");

module.exports = function serverRender({
    request,
    wildcatConfig
}) {
    let result = {};
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
        request,
        wildcatConfig
    });

    result = Object.assign({}, result, {
        html: html
    });

    return Promise.resolve(result);
};
