var React = require("react");
var Router = require("react-router");
var debounce = require("debounce");
var ExecutionEnvironment = require("exenv");
var storeClientSize = require("./storeClientSize.js");

/**
 * Client Router is used to handle client routing
 * @return {Promise}
 */
module.exports = function clientContext(cfg) {
    /* eslint-disable react/no-multi-comp */
    var ClientContext = React.createClass({
        childContextTypes: {
            radiumConfig: React.PropTypes.shape({
                userAgent: React.PropTypes.string
            })
        },

        componentDidMount: function () {
            if (ExecutionEnvironment.canUseDOM) {
                window.addEventListener("resize", this.onResize);
                this.onResize();
            }
        },

        componentWillUnmount: function () {
            if (ExecutionEnvironment.canUseDOM) {
                window.removeEventListener("resize", this.onResize);
            }
        },

        onResize: debounce(function () {
            storeClientSize(window);
        }, 50),

        getChildContext() {
            // Pass user agent to Radium
            return {
                radiumConfig: {
                    userAgent: ExecutionEnvironment.canUseDOM ? window.navigator.userAgent : null
                }
            };
        },

        render: function () {
            return (
                React.createElement(Router.default || Router, cfg, cfg.routes)
            );
        }
    });

    return React.createElement(ClientContext);
};
