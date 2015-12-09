import ensure from "react-wildcat-ensure";

// React router route
export const path = "/flexbox-example";

// Lazy loaded components
export function getComponent(location, cb) {
    return ensure("./FlexboxExample.js", module, function ensureResult(err, module) {
        return cb(err, module);
    });
}
