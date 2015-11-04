// React router route
export const path = "/prefetch-example";

// Lazy loaded components
export async function getComponent(location, cb) {
    try {
        return cb(null, await System.import("./PrefetchExample.js", module.id));
    } catch (e) {
        return cb(e);
    }
}
