var React = require("react");
var Router = require("react-router");
var debounce = require("debounce");
var ExecutionEnvironment = require("exenv");
var storeClientSize = require("./clientSize.js").storeClientSize;

/**
 * Client Router is used to handle client routing
 * @return {Promise}
 */
module.exports = function clientRouter(cfg) {
    var ClientRouter = React.createClass({
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

        render: function () {
            return (
                React.createElement(Router.default || Router, cfg, cfg.routes)
            );
        }
    });

    return React.createElement(ClientRouter);
};
