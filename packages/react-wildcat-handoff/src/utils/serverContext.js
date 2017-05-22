const React = require("react");
const PropTypes = require("prop-types");
const Router = require("react-router");

const RouterContext = Router.RouterContext;

module.exports = function serverContext(request, headers, renderProps) {
    const ServerContext = React.createClass({
        childContextTypes: {
            headers: PropTypes.shape({
                cookies: PropTypes.object,
                host: PropTypes.string,
                referrer: PropTypes.string,
                userAgent: PropTypes.string
            })
        },

        getChildContext() {
            // Pass user agent to Radium
            return {
                headers
            };
        },

        createElement(Component, props) {
            return React.createElement(Component, props);
        },

        render() {
            const createElement = this.createElement;

            return React.createElement(
                RouterContext,
                Object.assign(
                    {
                        createElement
                    },
                    this.props,
                    renderProps
                )
            );
        }
    });

    return React.createElement(ServerContext);
};
