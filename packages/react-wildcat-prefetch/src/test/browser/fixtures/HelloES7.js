import React from "react";

class Hello extends React.Component {
    static propTypes = {
        count: React.PropTypes.number,
        title: React.PropTypes.string
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
