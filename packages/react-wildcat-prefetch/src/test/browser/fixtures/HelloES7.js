import React from "react";
import PropTypes from "prop-types";

class Hello extends React.Component {
    static propTypes = {
        count: PropTypes.number,
        title: PropTypes.string
    };

    static defaultProps = {
        count: 0
    };

    static staticMethod() {
        return 42;
    }

    render() {
        return <div>{Object.keys(this.props)}</div>;
    }
}

export default Hello;
