"use strict";

const React = require("react");
const Router = require("react-router");
const RouterContext = Router.RouterContext;

module.exports = function serverContext(request, cookies, renderProps) {
    const userAgent = request.header["user-agent"];

    /* eslint-disable react/no-multi-comp */
    const ServerContext = React.createClass({
        childContextTypes: {
            radiumConfig: React.PropTypes.shape({
                userAgent: React.PropTypes.string
            })
        },

        getChildContext() {
            // Pass user agent to Radium
            return {
                radiumConfig: {
                    userAgent
                }
            };
        },

        render() {
            return React.createElement(RouterContext, Object.assign({}, this.props, renderProps));
        }
    });

    return React.createElement(ServerContext);
};
