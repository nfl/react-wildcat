import {mediaQueries} from "../../../components/Application/styles/globals.js";

const {desktop, largeDesktop} = mediaQueries;

const styles = {
    container: {
        userSelect: "auto",
        background: "#999",
        padding: 5
    },
    main: {
        minHeight: 800,
        margin: 0,
        padding: 0,
        display: "flex",
        flexFlow: "column",
        flexDirection: "column",

        [desktop]: {
            userSelect: "none",
            flexFlow: "row",
            flexDirection: "row"
        },

        [largeDesktop]: {
            flexFlow: "row",
            flexDirection: "row"
        }
    },
    article: {
        margin: 4,
        padding: 5,
        border: "1px solid #cccc33",
        borderRadius: "7pt",
        background: "#dddd88",
        flex: "3 1 60%",
        order: 0,

        [desktop]: {
            order: 2
        },

        [largeDesktop]: {
            order: 2
        }
    },
    nav: {
        margin: 4,
        padding: 5,
        border: "1px solid #8888bb",
        borderRadius: "7pt",
        background: "#ccccff",
        flex: "1 6 20%",
        order: 0,
        minHeight: 50,
        maxHeight: 50,

        [desktop]: {
            order: 1,
            minHeight: 0,
            maxHeight: "none"
        },

        [largeDesktop]: {
            order: 1,
            minHeight: 0,
            maxHeight: "none"
        }
    },
    aside: {
        margin: 4,
        padding: 5,
        border: "1px solid #8888bb",
        borderRadius: "7pt",
        background: "#ccccff",
        flex: "1 6 20%",
        order: 0,
        minHeight: 50,
        maxHeight: 50,

        [desktop]: {
            order: 3,
            minHeight: 0,
            maxHeight: "none"
        },

        [largeDesktop]: {
            order: 3,
            minHeight: 0,
            maxHeight: "none"
        }
    },
    header: {
        display: "block",
        margin: 4,
        padding: 5,
        border: "1px solid #eebb55",
        borderRadius: "7pt",
        background: "#ffeebb",
        minHeight: 50,
        maxHeight: 50,

        [desktop]: {
            minHeight: 100,
            maxHeight: "none"
        },

        [largeDesktop]: {
            minHeight: 100,
            maxHeight: "none"
        }
    },
    footer: {
        display: "block",
        margin: 4,
        padding: 5,
        border: "1px solid #eebb55",
        borderRadius: "7pt",
        background: "#ffeebb",
        minHeight: 50,
        maxHeight: 50,

        [desktop]: {
            minHeight: 100,
            maxHeight: "none"
        },

        [largeDesktop]: {
            minHeight: 100,
            maxHeight: "none"
        }
    }
};

export default styles;
