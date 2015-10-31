import React from "react";
import Helmet from "react-helmet";

class HelmetExample extends React.Component {
    render() {
        /**
         * If the render function start to get to large
         * creating a const can help clean up the code.
         * these properties can even come from a constants file
         */
        const meta = [
            {"name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"},
            {"name": "description", "content": "Helmet Example"},
            {"property": "og:type", "content": "article"}
        ];

        const link = [
            {"rel": "canonical", "href": "http://mysite.com/example"},
            {"rel": "apple-touch-icon", "href": "http://mysite.com/img/apple-touch-icon-57x57.png"},
            {"rel": "apple-touch-icon", "sizes": "72x72", "href": "http://mysite.com/img/apple-touch-icon-72x72.png"},
            {"rel": "apple-touch-icon", "sizes": "114x114", "href": "http://mysite.com/img/apple-touch-icon-114x114.png"}
        ];
        return (
            <div id="helmet">
                <Helmet title="Helmet Example" meta={meta} link={link} />
                <Helmet title="Nested Example"
                    meta={[
                        {"name": "description", "content": "Nested Example"}
                    ]}
                    link={[
                        {"rel": "canonical", "href": "http://mysite.com/example/nested"},
                        {"rel": "apple-touch-icon", "href": "http://mysite.com/img/nested-apple-touch-icon.png"}
                    ]}
                />

                <h3>Helmet Example</h3>

                <p>Please note:</p>
                <ul>
                    <li>1) The second Helmet component is overriding the meta description</li>
                    <li>2) The first Helmet component can specify duplicate tags</li>
                    <li>3) The second Helmet component can still override duplicate tags and will replace them all.</li>
                </ul>

                <p>The head in your source should contain these tags:</p>
                <pre>
                {`
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
                    <meta property="og:type" content="article">
                    <meta name="description" content="Nested Example" />
                    <link rel="canonical" href="http://mysite.com/example/nested" />
                    <link rel="apple-touch-icon" href="http://mysite.com/img/nested-apple-touch-icon.png" />
                `}
                </pre>
            </div>
        );
    }
}

export default HelmetExample;
