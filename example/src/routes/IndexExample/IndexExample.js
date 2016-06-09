import React from "react";
import Helmet from "react-helmet";

import largeFile from "assets/images/large-file.jpg";

class Index extends React.Component {
    render() {
        return (
            <div id="index">
                <Helmet title="Index Example" />
                <input type="checkbox" name="vehicle" value="Bike" />I have a bike<br />
                <input type="checkbox" name="vehicle" value="Car" />I have a car

                <h1>Index Page!</h1>
                <img width="300" src={largeFile} alt="An example of a large file." />
            </div>
        );
    }
}

export default Index;
