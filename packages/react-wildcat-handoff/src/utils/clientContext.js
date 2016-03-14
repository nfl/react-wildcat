var React = require("react");
var Router = require("react-router").Router;
var debounce = require("debounce");
var ExecutionEnvironment = require("exenv");

const radium = require("radium");
const StyleRoot = require("radium").StyleRoot;
const prefixAll = require("radium-plugin-prefix-all");
var storeClientSize = require("./storeClientSize.js");

/**
 * Client Router is used to handle client routing
 * @return {Promise}
 */
module.exports = function clientContext(cfg) {
    var userAgent = ExecutionEnvironment.canUseDOM ? window.navigator.userAgent : null;

    var plugins = [
        radium.Plugins.mergeStyleArray,
        radium.Plugins.checkProps,
        radium.Plugins.resolveMediaQueries,
        radium.Plugins.resolveInteractionStyles,
        radium.Plugins.prefix,
        prefixAll,
        radium.Plugins.checkProps
    ];

    /* eslint-disable react/no-multi-comp */
    var ClientContext = React.createClass({
        childContextTypes: {
            radiumConfig: React.PropTypes.shape({
                plugins: React.PropTypes.array,
                userAgent: React.PropTypes.string
            })
        },

        componentDidMount: function componentDidMount() {
            if (ExecutionEnvironment.canUseDOM) {
                window.addEventListener("resize", this.onResize);
                this.onResize();
            }
        },

        componentWillUnmount: function componentWillUnmount() {
            if (ExecutionEnvironment.canUseDOM) {
                window.removeEventListener("resize", this.onResize);
            }
        },

        onResize: debounce(function onResize() {
            storeClientSize(window);
        }, 50),

        getChildContext: function getChildContext() {
            // Pass user agent to Radium
            return {
                radiumConfig: {
                    plugins: plugins,
                    userAgent: userAgent
                }
            };
        },

        render: function render() {
            return React.createElement(
              StyleRoot,
              null,
              React.createElement(Router, cfg, cfg.routes)
            );
        }
    });

    return React.createElement(
      StyleRoot,
      null,
      React.createElement(ClientContext)
    );
};
