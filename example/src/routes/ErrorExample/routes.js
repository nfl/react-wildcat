// React router route
export const path = "/error-example";

// Lazy loaded components
export async function getComponent(location, cb) {
    try {
        const Module = await System.import("./ErrorExample.js", module.id);
        return cb(null, Module);
    } catch (e) {
        return cb(e);
    }
}
