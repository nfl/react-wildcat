import React from "react";

class CustomPrefetchStatic extends React.Component {
    static customFetchData() {
        return Promise.resolve(42);
    }

    render() {
        return (
            <div>
                {Object.keys(this.props)}
            </div>
        );
    }
}

export default CustomPrefetchStatic;
