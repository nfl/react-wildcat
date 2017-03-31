// Lazy loaded components
export function getComponent(location, cb) {
    import("./IndexExample.js")
        .then(module => cb(null, module.default), cb);
}
