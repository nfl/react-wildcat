import ensure from "react-wildcat-ensure";

// React router route
export const path = "/error-example";

// Lazy loaded components
export function getComponent(location, cb) {
    return ensure("./ErrorExample.js", module, (err, module) => {
        return cb(err, module);
    });
}
