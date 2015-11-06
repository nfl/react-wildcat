import defaultTemplate from "./defaultTemplate.js"; // eslint-disable-line import/default

export const wildcatConfig = {
    generalSettings: {
        staticUrl: "https://localhost:4000"
    },
    clientSettings: {
        entry: "public/main.js",
        reactRootElementID: "content",
        renderHandler: "react-wildcat-handoff/client"
    },
    serverSettings: {}
};

export const prefetchedDataKey = "stubData";

export const prefetchedData = {
    "stub": true
};

const nflCDN = `https://nflcdns.nfl.com/static/content/public/static`;

export const prefetchUrl = `${nflCDN}/config/anthology/superbowls/superbowls.json`;
export const prefetchInvalidUrl = `${nflCDN}/invalid.json`;

export const fetchPromise = () => Promise.resolve(exports.prefetchedData);

export const __INITIAL_DATA__ = "__INITIAL_DATA__";
export const __REACT_ROOT_ID__ = "__REACT_ROOT_ID__";

export {defaultTemplate};
