import ensure from "react-wildcat-ensure";

// React router route
export const path = "/preboot-example";

// Lazy loaded components
export function getComponent(location, cb) {
    return ensure("./PrebootExample.js", module, function ensureResult(err, module) {
        return cb(err, module);
    });
}

