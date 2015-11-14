import ensure from "../../../index.js"; // eslint-disable-line import/default

// React router route
export const path = "/import-async-example";

// Lazy loaded components
export function getComponent(location, cb) {
    return ensure("./single/AsyncErrorExample.fixture.js", module, (err, module) => {
        return cb(err, module);
    });
}
