"use strict";

const React = require("react");
const Router = require("react-router");
const RoutingContext = Router.RoutingContext;

module.exports = function serverContext(request, renderProps) {
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
                    userAgent: request.header["user-agent"] || "*"
                }
            };
        },

        render() {
            return React.createElement(RoutingContext, Object.assign({}, this.props, renderProps));
        }
    });

    return React.createElement(ServerContext);
};
