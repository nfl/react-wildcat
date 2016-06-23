"use strict";

const ReactDOM = require("react-dom/server");
const Router = require("react-router");
const serverContext = require("./serverContext.js");

const Helmet = require("react-helmet");
const defaultTemplate = require("./defaultTemplate.js");

const match = Router.match;

module.exports = function serverRender(cfg) {
    const headers = cfg.headers;
    const request = cfg.request;
    const wildcatConfig = cfg.wildcatConfig;

    return new Promise(function serverRenderPromise(resolve, reject) {
        match({
            history: cfg.history,
            location: cfg.location,
            routes: cfg.routes
        }, function serverRenderMatch(error, redirectLocation, renderProps) {
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
                let initialData = null;

                return Promise.all(
                    renderProps.components
                        .filter(function renderPropsFilter(component) {
                            return component.prefetch;
                        })
                        .map(function renderPropsMap(component) {
                            const prefetch = component.prefetch;
                            const key = prefetch.getKey();

                            return prefetch.run(renderProps).then(
                                function renderPropsPrefetchResult(props) {
                                    initialData = initialData || {};
                                    initialData[key] = prefetch[key] = props;
                                }
                            );
                        })
                )
                    .then(function serverRenderPromiseResult() {
                        var component = serverContext(cfg, headers, renderProps);

                        const renderType = wildcatConfig.serverSettings.renderType;
                        const getRenderType = (typeof renderType === "function") ?
                            renderType({
                                wildcatConfig,
                                request,
                                headers,
                                renderProps
                            }) : renderType;

                        const reactMarkup = ReactDOM[getRenderType](component);

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
                            wildcatConfig,
                            request,
                            headers,
                            renderProps
                        });

                        result = Object.assign({}, result, {
                            html: html,
                            status: 200
                        });

                        return resolve(result);
                    })
                    .catch(
                        /* istanbul ignore next */
                        function serverRenderError(err) {
                            return reject(err);
                        }
                    );
            }

            return resolve(result);
        });
    });
};
