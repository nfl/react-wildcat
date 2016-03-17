"use strict";

const React = require("react");
const Router = require("react-router");
const RouterContext = Router.RouterContext;

module.exports = function serverContext(request, cookies, renderProps) {
    /* eslint-disable react/no-multi-comp */
    const ServerContext = React.createClass({
        childContextTypes: {
            headers: React.PropTypes.shape({
                host: React.PropTypes.string,
                userAgent: React.PropTypes.string
            })
        },

        getChildContext() {
            // Pass user agent to Radium
            return {
                headers: {
                    host: request.header.host,
                    userAgent: request.header["user-agent"] || "*"
                }
            };
        },

        render() {
            return React.createElement(RouterContext, Object.assign({}, this.props, renderProps));
        }
    });

    return React.createElement(ServerContext);
};
