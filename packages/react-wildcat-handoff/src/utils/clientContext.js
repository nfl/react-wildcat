var React = require("react");
var Router = require("react-router").Router;
var ReactHotLoaderContainer = require("react-hot-loader").AppContainer;

/**
 * Client Router is used to handle client routing
 * @return {Promise}
 */
module.exports = function clientContext(cfg, headers, renderProps) {
    var ClientContext = React.createClass({
        childContextTypes: {
            headers: React.PropTypes.shape({
                cookies: React.PropTypes.object,
                host: React.PropTypes.string,
                referrer: React.PropTypes.string,
                userAgent: React.PropTypes.string
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

            return (
                React.createElement(Router, Object.assign({
                    createElement: createElement
                }, cfg, renderProps))
            );
        }
    });

    return React.createElement(
        ReactHotLoaderContainer,
        null,
        React.createElement(ClientContext)
    );
};
