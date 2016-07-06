import React from "react";
import Helmet from "react-helmet";

import largeFile from "assets/images/large-file.jpg";

class Index extends React.Component {

    handleClick() {
        alert("Client clicked!"); // eslint-disable-line no-alert
    }

    render() {
        return (
            <div id="preboot">
                <Helmet title="Index Example" />

                <h1>Preboot</h1>
                <p>Throttle your internet connection, or else the page may load too quickly to demonstrate.</p>
                <img width="300" src={largeFile} alt="An example of a large file." />
                <button onClick={this.handleClick} type="button">Click Me!</button>
            </div>
        );
    }
}

export default Index;
