import React from "react";
import PropTypes from "prop-types";

class Hello extends React.Component {
    static staticMethod() {
        return 42;
    }

    render() {
        return (
            <div>
                {Object.keys(this.props)}
            </div>
        );
    }
}
Hello.propTypes = {
    count: PropTypes.number,
    title: PropTypes.string
};
Hello.defaultProps = {count: 0};

export default Hello;
