const ReactDOM = require("react-dom/server");
const Router = require("react-router");
const serverContext = require("./serverContext.js");

const Helmet = require("react-helmet"); // eslint-disable-line import/no-unresolved
const defaultTemplate = require("./defaultTemplate.js");

const match = Router.match;

module.exports = function serverRender(cfg) {
    const {
        headers,
        request,
        wildcatConfig
    } = cfg;

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
                            let key = component.prefetch.getKey();

                            return component.prefetch.run(renderProps).then(
                                function renderPropsPrefetchResult(props) {
                                    initialData = initialData || {};

                                    initialData[key] = props;
                                    component.prefetch[key] = props;

                                    key = null;
                                    return component;
                                }
                            );
                        })
                )
                    .then(function serverRenderPromiseResult(prefetchedComponents) {
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
                            data: Object.assign({}, initialData),
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

                        // Delete stored object
                        initialData = null;

                        // Delete stored objects
                        prefetchedComponents
                            .filter(function renderPropsFilter(_component) {
                                return _component.prefetch;
                            })
                            .forEach(function withPrefetchedComponent(_component) {
                                let key = _component.prefetch.getKey();

                                /* istanbul ignore next */
                                if (_component.prefetch[key]) {
                                    _component.prefetch[key] = null;
                                }

                                key = null;
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
