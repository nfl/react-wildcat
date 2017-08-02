// React router route
export const path = "/error-example";

// Lazy loaded components
export function getComponent(location, cb) {
    import("./ErrorExample.js").then(module => cb(null, module.default), cb);
}
