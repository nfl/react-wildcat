import React from "react";

class DefaultPrefetchStatic extends React.Component {
    static displayName = "DefaultPrefetchStatic";

    static fetchData() {
        return Promise.resolve(42);
    }

    render() {
        return <div>{Object.keys(this.props)}</div>;
    }
}

export default DefaultPrefetchStatic;
