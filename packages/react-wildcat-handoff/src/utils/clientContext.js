var React = require("react");
var Router = require("react-router").Router;
var ExecutionEnvironment = require("exenv");

/**
 * Client Router is used to handle client routing
 * @return {Promise}
 */
module.exports = function clientContext(cfg) {
    /* eslint-disable react/no-multi-comp */
    var ClientContext = React.createClass({
        childContextTypes: {
            headers: React.PropTypes.shape({
                host: React.PropTypes.string,
                userAgent: React.PropTypes.string
            })
        },

        getChildContext: function getChildContext() {
            // Pass user agent to Radium
            return {
                headers: {
                    host: ExecutionEnvironment.canUseDOM ? window.location.host : null,
                    userAgent: ExecutionEnvironment.canUseDOM ? window.navigator.userAgent : null
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
