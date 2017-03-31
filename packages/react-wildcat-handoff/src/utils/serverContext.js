const React = require("react");
const Router = require("react-router");

const RouterContext = Router.RouterContext;

module.exports = function serverContext(request, headers, renderProps) {
    const ServerContext = React.createClass({
        childContextTypes: {
            headers: React.PropTypes.shape({
                cookies: React.PropTypes.object,
                host: React.PropTypes.string,
                referrer: React.PropTypes.string,
                userAgent: React.PropTypes.string
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

            return (
                React.createElement(RouterContext, Object.assign({
                    createElement
                }, this.props, renderProps))
            );
        }
    });

    return React.createElement(ServerContext);
};
