import ensure from "react-wildcat-ensure";

// Lazy loaded components
export function getComponent(location, cb) {
    return ensure("./IndexExample.js", module, function ensureResult(err, module) {
        return cb(err, module);
    });
}
