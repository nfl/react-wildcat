var React = require("react");
var Router = require("react-router").Router;
var cookie = require("cookie");

/**
 * Client Router is used to handle client routing
 * @return {Promise}
 */
module.exports = function clientContext(cfg) {
    /* eslint-disable react/no-multi-comp */
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
                headers: {
                    cookies: cookie.parse(document.cookie),
                    host: window.location.host,
                    referrer: document.referrer,
                    userAgent: window.navigator.userAgent
                }
            };
        },

        render: function render() {
            return (
                React.createElement(Router, cfg)
            );
        }
    });

    return React.createElement(ClientContext);
};
