import ensure from "../../../index.js"; // eslint-disable-line import/default

// React router route
export const path = "/import-multi-async-example";

// Lazy loaded child routes
export function getChildRoutes(location, cb) {
    return ensure([
        "./array/AsyncExampleOne.fixture.js",
        "./array/AsyncExampleMixed.fixture.js"
    ], module, (err, modules) => {
        return cb(err, modules);
    });
}

// Lazy loaded components
export function getComponents(location, cb) {
    return ensure([
        "./array/AsyncExampleOne.fixture.js",
        "./array/AsyncExampleTwo.fixture.js"
    ], module, (err, modules) => {
        return cb(err, modules);
    });
}
