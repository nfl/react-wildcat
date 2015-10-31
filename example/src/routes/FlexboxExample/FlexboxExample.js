import React from "react";
import Helmet from "react-helmet";

import radium from "react-wildcat-radium";
import styles from "./styles/index.js";

@radium
class FlexboxExample extends React.Component {
    render() {
        return (
            <div id="flexbox">
                <Helmet title="Flexbox Example" />

                <h3>Flexbox Example</h3>
                <div
                    key="container"
                    style={styles.container}
                >
                    <header
                        key="header"
                        style={styles.header}
                    >
                        header
                    </header>

                    <div
                        key="main"
                        style={styles.main}
                    >
                        <article
                            key="article"
                            style={styles.article}
                        >
                            article
                        </article>

                        <nav
                            key="nav"
                            style={styles.nav}
                        >
                            nav
                        </nav>

                        <aside
                            key="aside"
                            style={styles.aside}
                        >
                            aside
                        </aside>
                    </div>

                    <footer
                        key="footer"
                        style={styles.footer}
                    >
                        footer
                    </footer>
                </div>
            </div>
        );
    }
}

export default FlexboxExample;
