import React from "react";
import ExecutionEnvironment from "exenv";
import invariant from "invariant";
import hoistStatics from "hoist-non-react-statics";

const __INITIAL_DATA__ = "__INITIAL_DATA__";
const __DEFAULT_KEY__ = "asyncData";

function getAction(action, ComposedComponent) {
    switch (typeof action) {
        case "function":
            return action;

        case "string":
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
                                error: error
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
function prefetch(action, options) {
    var key;

    options = options || {};
    key = options.key || (typeof options === "string" ? options : __DEFAULT_KEY__);

    return function wrap(ComposedComponent) {
        var _action = getAction(action, ComposedComponent);

        var Prefetch = React.createClass({
            componentWillMount: function componentWillMount() {
                /* istanbul ignore else */
                if (ExecutionEnvironment.canUseDOM) {
                    var initialData = window[__INITIAL_DATA__] ? {
                        ...window[__INITIAL_DATA__]
                    } : undefined;

                    var newState = {};

                    if (initialData) {
                        // Delete stored objects
                        if (window[__INITIAL_DATA__] && window[__INITIAL_DATA__][key]) {
                            delete window[__INITIAL_DATA__][key];

                            if (!Object.keys(window[__INITIAL_DATA__]).length) {
                                delete window[__INITIAL_DATA__];
                            }
                        }

                        if (Prefetch.prefetch[key]) {
                            delete Prefetch.prefetch[key];
                        }

                        invariantCheck(initialData, key, action, ComposedComponent);

                        newState[key] = initialData[key];
                        return this.setState(newState);
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
            },

            getInitialState: function getInitialState() {
                return {};
            },

            render: function render() {
                const props = {};
                props[key] = this.state[key] || Prefetch.prefetch[key];

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

        return hoistStatics(Prefetch, ComposedComponent);
    };
}

module.exports = prefetch;
