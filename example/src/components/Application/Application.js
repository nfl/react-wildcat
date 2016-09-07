import React from "react";
import radium from "radium";
import {Link as RawLink} from "react-router";
import {metrics} from "react-metrics";
import metricsConfig from "metrics.config.js";

import {links} from "application.config.js";
import styles from "./styles/applicationStyles.js";

// Wrap <Link> due to Radium fringe issue
// See: https://github.com/FormidableLabs/radium/tree/master/docs/faq#why-doesnt-radium-work-on-somecomponent
const Link = radium(RawLink);

class Application extends React.Component {
    static propTypes = {
        children: React.PropTypes.node
    };

    render() {
        return (
            <div style={styles.application}>
                <div style={styles.container}>
                    <header>
                        <nav role="navigation">
                            <ul>
                                {links.map((link) => {
                                    const {text, ...rest} = link;
                                    return (
                                        <li key={text}>
                                            <Link
                                                style={styles.a}
                                                {...rest}
                                            >
                                                {text}
                                            </Link>
                                        </li>
                                    );
                                })}
                                <li>
                                    <a href="not-found-route" key={404} style={styles.a}>404 Handling</a>
                                </li>
                            </ul>
                        </nav>
                    </header>
                    <main role="main">
                        {this.props.children}
                    </main>
                </div>
            </div>
        );
    }
}

export {Application as ApplicationComponent};
export default metrics(metricsConfig)(
    radium(Application)
);
