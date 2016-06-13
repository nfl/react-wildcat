import React from "react";
import Helmet from "react-helmet";

import largeFile from "assets/images/large-file.jpg";

class Index extends React.Component {
    render() {
        return (
            <div id="index">
                <Helmet title="Index Example" />
                <span>First name:</span><input type="text" name="fname"></input>
                <span>Last name:</span><input type="text" name="lname"></input>
                <button onClick="clientClick()">Client View</button>

                <h1>Index Page!</h1>
                <img width="300" src={largeFile} alt="An example of a large file." />
            </div>
        );
    }
}

export default Index;
