import React from "react";
import PropTypes from "prop-types";
import radium, {StyleRoot} from "radium";
// import prefixAll from "radium-plugin-prefix-all";

import Application from "./Application.js";

class ApplicationContext extends React.Component {
    static contextTypes = {
        headers: PropTypes.shape({
            host: PropTypes.string,
            userAgent: PropTypes.string
        })
    };

    static propTypes = {
        children: PropTypes.any
    };

    render() {
        const {headers} = this.context;

        return (
            <StyleRoot
                radiumConfig={{
                    userAgent: headers.userAgent,

                    plugins: [
                        radium.Plugins.mergeStyleArray,
                        radium.Plugins.checkProps,
                        radium.Plugins.resolveMediaQueries,
                        radium.Plugins.resolveInteractionStyles,
                        radium.Plugins.prefix,
                        // prefixAll,
                        // customRadiumPlugin
                        // ...etc
                        radium.Plugins.checkProps
                    ]
                }}
            >
                <Application {...this.props} />
            </StyleRoot>
        );
    }
}

export default ApplicationContext;
