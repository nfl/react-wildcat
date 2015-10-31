// React router route
export const path = "/helmet-example";

// Lazy loaded components
export async function getComponent(location, cb) {
    try {
        const Module = await System.import("./HelmetExample.js", module.id);
        return cb(null, Module);
    } catch (e) {
        return cb(e);
    }
}
