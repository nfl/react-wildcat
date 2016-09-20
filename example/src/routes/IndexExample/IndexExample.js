import React from "react";
import Helmet from "react-helmet";

import largeFile from "assets/images/large-file.jpg";

class Index extends React.Component {
    render() {
        return (
            <div id="index">
                <Helmet title="Index Example" />

                <h1>Index Page!</h1>
                <img alt="An example of a large file." src={largeFile} width="300" />
            </div>
        );
    }
}

export default Index;
