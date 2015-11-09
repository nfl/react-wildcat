import ensure from "../../../index.js"; // eslint-disable-line import/default

// React router route
export const path = "/import-async-example";

// Lazy loaded components
export function getComponents(location, cb) {
    return ensure({
        one: "./AsyncErrorExampleOne.js",
        two: "./AsyncErrorExampleTwo.js"
    }, module, (err, module) => {
        return cb(err, module);
    });
}
