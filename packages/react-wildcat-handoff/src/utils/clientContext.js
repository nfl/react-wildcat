var React = require("react");
var PropTypes = require("prop-types");
var Router = require("react-router").Router;
var ReactHotLoaderContainer = require("react-hot-loader").AppContainer;

/**
 * Client Router is used to handle client routing
 * @return {Promise}
 */
module.exports = function clientContext(cfg, headers, renderProps) {
    var ClientContext = React.createClass({
        childContextTypes: {
            headers: PropTypes.shape({
                cookies: PropTypes.object,
                host: PropTypes.string,
                referrer: PropTypes.string,
                userAgent: PropTypes.string
            })
        },

        getChildContext: function getChildContext() {
            // Pass user agent to Radium
            return {
                headers: headers
            };
        },

        createElement: function createElement(Component, props) {
            return React.createElement(Component, props);
        },

        render: function render() {
            var createElement = this.createElement;

            return React.createElement(
                Router,
                Object.assign(
                    {
                        createElement: createElement
                    },
                    cfg,
                    renderProps
                )
            );
        }
    });

    return React.createElement(
        ReactHotLoaderContainer,
        null,
        React.createElement(ClientContext)
    );
};
