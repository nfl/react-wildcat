const __moduleCache = {};

function ensure(importPaths, {id}, cb) {
    let moduleCacheName;

    if (!__moduleCache[id]) {
        __moduleCache[id] = {};
    }

    // Handle a single import
    if (typeof importPaths === "string") {
        moduleCacheName = importPaths;

        if (__moduleCache[id][moduleCacheName]) {
            return cb(null, __moduleCache[id][moduleCacheName]);
        }

        return System.import(importPaths, id)
            .then(module => {
                __moduleCache[id][moduleCacheName] = module;
                return cb(null, __moduleCache[id][moduleCacheName]);
            })
            .catch(e => cb(e));
    }

    // Handle an array of imports
    if (Array.isArray(importPaths)) {
        moduleCacheName = importPaths.join(",");

        if (__moduleCache[id][moduleCacheName]) {
            return cb(null, __moduleCache[id][moduleCacheName]);
        }

        return Promise.all(
            importPaths
                .map(importPath => System.import(importPath, id))
        )
            .then(modules => {
                __moduleCache[id][moduleCacheName] = modules;
                return cb(null, __moduleCache[id][moduleCacheName]);
            })
            .catch(e => cb(e));
    }

    const importPathKeys = Object.keys(importPaths);
    const moduleHashCache = {};

    moduleCacheName = importPathKeys.join(",");

    if (__moduleCache[id][moduleCacheName]) {
        return cb(null, __moduleCache[id][moduleCacheName]);
    }

    // Handle a key/value hash of imports
    return Promise.all(
        Object.keys(importPaths)
            .map(moduleName => System.import(importPaths[moduleName], id))
    )
        .then(modules => {
            importPathKeys
                .forEach((moduleName, idx) => moduleHashCache[moduleName] = modules[idx]);

            __moduleCache[id][moduleCacheName] = moduleHashCache;
            return cb(null, __moduleCache[id][moduleCacheName]);
        })
        .catch(e => cb(e));
}

export {__moduleCache};
export default ensure;
