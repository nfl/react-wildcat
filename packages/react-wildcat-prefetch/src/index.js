const React = require("react");
const ExecutionEnvironment = require("exenv");
const invariant = require("invariant");
const hoistStatics = require("hoist-non-react-statics");

const __DEFAULT_INITIAL_DATA_KEY__ = "__INITIAL_DATA__";
const __DEFAULT_ASYNC_DATA_KEY__ = "asyncData";
const __DEFAULT_STATIC_METHOD__ = "fetchData";

function getAction(action, ComposedComponent) {
    switch (typeof action) {
        case "function":
            return action;

        case "string":
            if (ComposedComponent.hasOwnProperty(action)) {
                return ComposedComponent[action];
            }

            return function asyncAction() {
                return new Promise(function asyncPromise(resolve) {
                    return fetch(action)
                        .then(function asyncPromiseResponse(response) {
                            return response.json();
                        })
                        .then(function asyncPromiseJSON(json) {
                            return resolve(json);
                        })
                        .catch(function asyncPromiseError(error) {
                            return resolve({
                                error
                            });
                        });
                });
            };
    }

    return invariant(
        false,
        "Action must be typeof function or a string. check %s prefetch",
        ComposedComponent.displayName
    );
}

function invariantCheck(exists, key, action, ComposedComponent) {
    invariant(
        exists,
        "Prefetch did not retrieve any data with key " + key + " for component " + ComposedComponent.displayName + ". This either means an error occurred attempting to reach the provided data endpoint" + ((typeof action === "string") ? (" " + action) : "") + ", or this component is a child of a route component. The Prefetch decorator can only be used on top-level route components."
    );
}

function getDisplayName(Comp) {
    return Comp.displayName || Comp.name || "Component";
}

/**
 *
 * @param {React.Component} Component
 * @param {function|string} action, needs to return a promise
 * @param {string} key, key where the data will resolve to
 * @returns {React.Component}
 *
 * This function will fetch the data and return the data to the props `key`
 *
 * If action is a function it will execute the function
 * If action is an string it will make a request based on that url
 */
function prefetchWrap(action, options) {
    var key;

    options = options || {};
    key = options.key || (typeof options === "string" ? options : __DEFAULT_ASYNC_DATA_KEY__);

    return function prefetchWrapper(ComposedComponent) {
        action = action || ComposedComponent[__DEFAULT_STATIC_METHOD__];
        var _action = getAction(action, ComposedComponent);

        var Prefetch = React.createClass({
            propTypes: {
                [__DEFAULT_INITIAL_DATA_KEY__]: React.PropTypes.string
            },

            componentWillMount: function componentWillMount() {
                var canUseDOM = (typeof options.canUseDOM !== "undefined") ? options.canUseDOM : ExecutionEnvironment.canUseDOM;

                /* istanbul ignore else */
                if (canUseDOM) {
                    var initialDataID = this.props[__DEFAULT_INITIAL_DATA_KEY__] || __DEFAULT_INITIAL_DATA_KEY__;

                    var initialData = window[initialDataID] ? {
                        ...window[initialDataID]
                    } : undefined;

                    var newState = {};

                    if (initialData) {
                        // Delete stored objects
                        if (window[initialDataID] && window[initialDataID][key]) {
                            delete window[initialDataID][key];

                            if (!Object.keys(window[initialDataID]).length) {
                                delete window[initialDataID];
                            }
                        }

                        if (Prefetch.prefetch[key]) {
                            delete Prefetch.prefetch[key];
                        }

                        invariantCheck(initialData, key, action, ComposedComponent);

                        if (key in initialData) {
                            newState[key] = initialData[key];
                            return this.setState(newState);
                        }
                    }

                    return _action(this.props)
                        .then(function asyncData(data) {
                            initialData = {
                                [key]: data
                            };

                            invariantCheck(initialData, key, action, ComposedComponent);

                            newState[key] = initialData[key];
                            return this.setState(newState);
                        }.bind(this));
                }

                if (Prefetch.prefetch[key]) {
                    this.setState({
                        [key]: Prefetch.prefetch[key]
                    });

                    // Delete stored object
                    delete Prefetch.prefetch[key];
                }
            },

            getInitialState: function getInitialState() {
                return {};
            },

            render: function render() {
                const props = {};
                props[key] = this.state[key];

                return <ComposedComponent {...this.props} {...props} />;
            }
        });

        Prefetch.prefetch = {
            run: function run(props) {
                return _action(props);
            },

            getKey: function getKey() {
                return key;
            }
        };

        Prefetch.WrappedComponent = ComposedComponent;
        Prefetch.displayName = "Prefetch(" + getDisplayName(ComposedComponent) + ")";

        return hoistStatics(Prefetch, ComposedComponent);
    };
}

module.exports = function prefetch(target, ...args) {
    if (typeof target === "function" && typeof target.displayName === "string") {
        return prefetchWrap()(target, ...args);
    }

    return prefetchWrap(target, ...args);
};
