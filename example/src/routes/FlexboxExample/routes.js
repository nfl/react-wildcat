// React router route
export const path = "/flexbox-example";

// Lazy loaded components
export function getComponent(location, cb) {
    import("./FlexboxExample.js")
        .then(module => cb(null, module.default), cb);
}
