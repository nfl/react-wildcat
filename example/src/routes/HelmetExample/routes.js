// React router route
export const path = "/helmet-example";

// Lazy loaded components
export function getComponent(location, cb) {
    import("./HelmetExample.js").then(module => cb(null, module.default), cb);
}
