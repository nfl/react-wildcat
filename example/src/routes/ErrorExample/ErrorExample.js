import React from "react";
import Helmet from "react-helmet";

class ErrorExample extends React.Component {
    render() {
        return (
            <div id="error">
                <Helmet title="Error Example" />

                {this.props()}
            </div>
        );
    }
}

export default ErrorExample;
