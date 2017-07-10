const React = require("react");
const PropTypes = require("prop-types");
const Router = require("react-router");
const createReactClass = require("create-react-class");

const RouterContext = Router.RouterContext;

module.exports = function serverContext(
    {request, response}, // eslint-disable-line react/prop-types
    headers,
    renderProps
) {
    const ServerContext = createReactClass({
        childContextTypes: {
            headers: PropTypes.shape({
                cookies: PropTypes.object,
                host: PropTypes.string,
                referrer: PropTypes.string,
                userAgent: PropTypes.string
            }),
            request: PropTypes.object,
            response: PropTypes.object
        },

        getChildContext() {
            // Pass user agent to Radium
            return {
                headers,
                request,
                response
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
