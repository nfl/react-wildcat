// "Globals" such as fonts and colors can be defined explicitly and changed programmatically, and are available only where they are required.
import primaryBackground from "assets/images/primary-background.jpg";

// "Globals" such as fonts and colors can be defined explicitly and changed programmatically, and are available only where they are required.
const globals = {
    primaryFontFamily: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
    primaryFontSize: 14,
    primaryColor: "black",
    primaryLinkColor: "blue",
    primaryLinkFontWeight: "normal",
    primaryLinkTextDecoration: "underline",
    primaryLinkHoverColor: "purple",
    primaryLinkHoverFontWeight: "bold",
    primaryLinkHoverTextDecoration: "none",
    primaryBackground: `#fff url(${primaryBackground}) repeat-x top center`
};

const mediaQueries = {
    mobile: "@media (min-width: 480px)",
    tablet: "@media (min-width: 768px)",
    desktop: "@media (min-width: 992px)",
    largeDesktop: "@media (min-width: 1200px)"
};

export {globals, mediaQueries};
