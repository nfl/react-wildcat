// React router route
export const path = "/prefetch-example";

// Lazy loaded components
export async function getComponent(location, cb) {
    try {
        const Module = await System.import("./PrefetchExample.js", module.id);
        return cb(null, Module);
    } catch (e) {
        return cb(e);
    }
}
