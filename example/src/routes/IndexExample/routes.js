// Lazy loaded components
export async function getComponent(location, cb) {
    try {
        const Module = await System.import("./IndexExample.js", module.id);
        return cb(null, Module);
    } catch (e) {
        return cb(e);
    }
}
