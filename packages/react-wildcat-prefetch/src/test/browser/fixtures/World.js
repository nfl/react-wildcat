/* eslint-disable react/prefer-es6-class, react/sort-comp */
import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

const World = createReactClass({
    displayName: "World Component",

    propTypes: {
        count: PropTypes.number,
        title: PropTypes.string
    },

    statics: {
        staticMethod() {
            return 42;
        }
    },

    getDefaultProps() {
        return {
            count: 0
        };
    },

    render() {
        return <div>{Object.keys(this.props)}</div>;
    }
});

export default World;
