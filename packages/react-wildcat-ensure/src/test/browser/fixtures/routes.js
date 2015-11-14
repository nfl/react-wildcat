import ensure from "../../../index.js"; // eslint-disable-line import/default

// React router route
export const path = "/import-async-example";

// Lazy loaded index route
export function getIndexRoute(location, cb) {
    return ensure("./AsyncExampleIndex.js", module, (err, module) => {
        return cb(err, module);
    });
}

// Lazy loaded components
export function getComponent(location, cb) {
    return ensure("./AsyncExampleOne.js", module, (err, module) => {
        return cb(err, module);
    });
}
