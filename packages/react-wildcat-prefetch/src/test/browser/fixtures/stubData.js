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
    "asyncData": {
        "stub": true
    },

    "asyncArrayData": [1, 2, 3],

    "firstData": {
        "first": true
    },

    "secondData": {
        "second": true
    }
};

export const prefetchedDataCustomKey = {
    [prefetchedDataKey]: {
        "stub": true
    }
};

export const prefetchUrl = "https://example.com/example.json";
export const prefetchInvalidUrl = "https://example.com/invalid.json";

export const fetchPromise = () => Promise.resolve(prefetchedData.asyncData);
export const firstFetchPromise = () => Promise.resolve(prefetchedData.firstData);
export const secondFetchPromise = () => Promise.resolve(prefetchedData.secondData);
export const arrayFetchPromise = () => Promise.resolve(prefetchedData.asyncArrayData);
export const fetchPromiseCustomKey = () => Promise.resolve(prefetchedDataCustomKey);

export const __INITIAL_DATA__ = "__INITIAL_DATA__";
export const __REACT_ROOT_ID__ = "__REACT_ROOT_ID__";

export {defaultTemplate};
