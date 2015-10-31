import React from "react";

const World = React.createClass({
    displayName: "World Component",

    propTypes: {
        count: React.PropTypes.number,
        title: React.PropTypes.string
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
