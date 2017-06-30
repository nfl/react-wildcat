// React router route
export const path = "/prefetch-example";

// Lazy loaded components
export function getComponent(location, cb) {
    import("./PrefetchExample.js").then(module => cb(null, module.default), cb);
}
