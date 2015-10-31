import {
    globals,
    mediaQueries
} from "./globals.js";

const {tablet, desktop, largeDesktop} = mediaQueries;

// Sample Style Object
const styles = {
    application: {
        background: globals.primaryBackground,
        paddingTop: 5
    },
    container: {
        color: globals.primaryColor,
        fontFamily: globals.primaryFontFamily,
        fontSize: globals.primaryFontSize,
        margin: "0 auto",
        width: 400,

        [tablet]: {
            width: 600
        },

        [desktop]: {
            width: 600
        },

        [largeDesktop]: {
            width: 1000
        }
    },
    a: {
        color: globals.primaryLinkColor,
        fontWeight: globals.primaryLinkFontWeight,
        textDecoration: globals.primaryLinkTextDecoration,

        ":hover": {
            color: globals.primaryLinkHoverColor,
            fontWeight: globals.primaryLinkHoverFontWeight,
            textDecoration: globals.primaryLinkHoverTextDecoration
        }
    }
};


export default styles;
