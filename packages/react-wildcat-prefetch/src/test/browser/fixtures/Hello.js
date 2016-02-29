import React from "react";

class Hello extends React.Component {
    static staticMethod() {
        return 42;
    }

    render() {
        return <div>{Object.keys(this.props)}</div>;
    }
}
Hello.propTypes = {
    count: React.PropTypes.number,
    title: React.PropTypes.string
};
Hello.defaultProps = {count: 0};

export default Hello;
