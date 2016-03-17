import React from "react";
import radium, {StyleRoot} from "radium";
// import prefixAll from "radium-plugin-prefix-all";

import Application from "./Application.js";

class ApplicationContext extends React.Component {
    static contextTypes = {
        radiumConfig: React.PropTypes.shape({
            userAgent: React.PropTypes.string
        })
    };

    static propTypes = {
        children: React.PropTypes.any
    };

    render() {
        const {radiumConfig} = this.context;

        return (
            <StyleRoot radiumConfig={{
                ...radiumConfig,

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
            }}>
                <Application {...this.props} />
            </StyleRoot>
        );
    }
}

export default ApplicationContext;
