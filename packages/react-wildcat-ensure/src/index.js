const __moduleCache = {};

function ensure(importPaths, {id}, cb) {
    if (!__moduleCache[id]) {
        // Handle a single import
        if (typeof importPaths === "string") {
            return System.import(importPaths, id)
                .then(module => {
                    __moduleCache[id] = module;
                    return cb(null, __moduleCache[id]);
                })
                .catch(e => cb(e));
        }

        // Handle an array of imports
        if (Array.isArray(importPaths)) {
            return Promise.all(
                importPaths
                    .map(importPath => System.import(importPath, id))
            )
                .then(modules => {
                    __moduleCache[id] = modules;
                    return cb(null, __moduleCache[id]);
                })
                .catch(e => cb(e));
        }

        const moduleHashCache = {};

        // Handle a key/value hash of imports
        return Promise.all(
            Object.keys(importPaths)
                .map(moduleName => System.import(importPaths[moduleName], id))
        )
            .then(modules => {
                Object.keys(importPaths)
                    .forEach((moduleName, idx) => moduleHashCache[moduleName] = modules[idx]);

                __moduleCache[id] = moduleHashCache;
                return cb(null, __moduleCache[id]);
            })
            .catch(e => cb(e));
    }

    return cb(null, __moduleCache[id]);
}

export {__moduleCache};
export default ensure;
