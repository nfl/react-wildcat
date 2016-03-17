var React = require("react");
var Router = require("react-router").Router;
var ExecutionEnvironment = require("exenv");

/**
 * Client Router is used to handle client routing
 * @return {Promise}
 */
module.exports = function clientContext(cfg) {
    var userAgent = ExecutionEnvironment.canUseDOM ? window.navigator.userAgent : null;

    /* eslint-disable react/no-multi-comp */
    var ClientContext = React.createClass({
        childContextTypes: {
            radiumConfig: React.PropTypes.shape({
                userAgent: React.PropTypes.string
            })
        },

        getChildContext: function getChildContext() {
            // Pass user agent to Radium
            return {
                radiumConfig: {
                    userAgent: userAgent
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
