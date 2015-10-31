import React from "react";
import ExecutionEnvironment from "exenv";
import invariant from "invariant";
import hoistStatics from "hoist-non-react-statics";

const __INITIAL_DATA__ = "__INITIAL_DATA__";

function getAction(action, ComposedComponent) {
    switch (typeof action) {
        case "function":
            return action;

        case "string":
            return function asyncAction() {
                return fetch(action)
                    .then(function (response) {
                        return response.json();
                    })
                    .catch(function (e) {
                        console.error(e);
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
function prefetch(action, key) {
    key = key || "asyncData";

    return function wrap(ComposedComponent) {
        var _action = getAction(action, ComposedComponent);

        var Prefetch = React.createClass({
            componentWillMount: function componentWillMount() {
                if (ExecutionEnvironment.canUseDOM) {
                    var initialDataTarget = window[__INITIAL_DATA__] || Prefetch.prefetch;

                    var initialData;
                    var newState = {};

                    if (initialDataTarget && initialDataTarget[key]) {
                        initialData = {
                            ...initialDataTarget[key]
                        };

                        // Delete stored object
                        delete initialDataTarget[key];

                        invariantCheck(initialData, key, action, ComposedComponent);

                        newState[key] = initialData;
                        this.setState(newState);
                    } else if (typeof _action === "function") {
                        _action(this.props)
                            .then(function asyncData(data) {
                                initialData = data;

                                invariantCheck(initialData, key, action, ComposedComponent);

                                newState[key] = initialData;
                                this.setState(newState);
                            }.bind(this));
                    }
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
