"use strict";

const ReactDOM = require("react-dom/server");
const Helmet = require("react-helmet");
const Router = require("react-router");
const defaultTemplate = require("./defaultTemplate.js");

const radium = require("react-wildcat-radium");
const matchMediaMock = require("match-media-mock").create();

const getClientSize = require("./getClientSize.js");
const serverContext = require("./serverContext.js");

const match = Router.match;

radium.setMatchMedia(matchMediaMock);

module.exports = function serverRender(cfg) {
    const cookies = cfg.cookies;
    const request = cfg.request;
    const wildcatConfig = cfg.wildcatConfig;

    return new Promise((resolve, reject) => {
        match(cfg, (error, redirectLocation, renderProps) => {
            let result = {};

            if (error) {
                return reject(error);
            }

            if (redirectLocation) {
                result = {
                    redirect: true,
                    redirectLocation,
                    status: 301
                };
            } else if (!renderProps) {
                result = {
                    error: "Not found",
                    status: 404
                };
            } else {
                const clientSize = getClientSize(cookies, request.query);

                matchMediaMock.setConfig({
                    type: "screen",
                    height: clientSize.height,
                    width: clientSize.width
                });

                const initialData = {};

                return Promise.all(
                    renderProps.components
                        .filter(component => component.prefetch)
                        .map(component => {
                            const prefetch = component.prefetch;
                            const key = prefetch.getKey();

                            return prefetch.run(renderProps).then(props => {
                                initialData[key] = prefetch[key] = props;
                            });
                        })
                ).then(() => {
                    const reactMarkup = ReactDOM.renderToString(
                        serverContext(request, renderProps)
                    );

                    const head = Object.assign({
                        link: "",
                        meta: "",
                        title: ""
                    }, Helmet.rewind());

                    const htmlTemplate = wildcatConfig.serverSettings.htmlTemplate || defaultTemplate;

                    const html = htmlTemplate({
                        data: initialData,
                        head: head,
                        html: reactMarkup,
                        wildcatConfig: wildcatConfig
                    });

                    result = Object.assign({}, result, {
                        html: html,
                        status: 200
                    });

                    return resolve(result);
                });
            }

            return resolve(result);
        });
    });
};
