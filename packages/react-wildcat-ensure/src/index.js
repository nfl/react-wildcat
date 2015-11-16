function hasCachedModule(moduleName) {
    return System.has(moduleName);
}

function getNormalizedName(moduleName, id) {
    return System.normalizeSync(moduleName, id);
}

function getCachedModule(moduleName) {
    const cachedModule = System.get(moduleName);

    if (!cachedModule) {
        return cachedModule;
    }

    return cachedModule.__useDefault ? cachedModule.default : cachedModule;
}

function ensureString(importPath, id, cb) {
    if (importPath && id) {
        importPath = getNormalizedName(importPath, id);
    }

    if (hasCachedModule(importPath)) {
        return cb(null, getCachedModule(importPath));
    }

    return System.import(importPath)
        .then(importedModule => cb(null, importedModule))
        .catch(e => cb(e));
}

function ensureArray(importPaths, id, cb) {
    const normalizedImports = importPaths
        .map(importPath => getNormalizedName(importPath, id));

    const cachedImports = normalizedImports
        .map(normalizedImport => getCachedModule(normalizedImport))
        .filter(normalizedImport => normalizedImport);

    if (cachedImports.length === normalizedImports.length) {
        return cb(null, cachedImports);
    }

    return Promise.all(
        normalizedImports
            .map(normalizedImport => ensureString(normalizedImport, null, (err, importedModules) => {
                if (err) {
                    return Promise.reject(err);
                }

                return Promise.resolve(importedModules);
            }))
    )
        .then(importedModules => cb(null, importedModules))
        .catch(e => cb(e));
}

function ensureHash(importPaths, id, cb) {
    const importPathKeys = Object.keys(importPaths);
    const moduleHashCache = {};

    importPaths = importPathKeys.map(importPath => importPaths[importPath]);

    return ensureArray(importPaths, id, (err, importedModules) => {
        if (err) {
            return cb(err);
        }

        importPathKeys
            .forEach((importPath, idx) => {
                const importedModule = importedModules[idx];
                moduleHashCache[importPath] = importedModule;
            });

        return cb(null, moduleHashCache);
    });
}

function ensure(importPaths, {id}, cb) {
    // Handle a single import
    if (typeof importPaths === "string") {
        return ensureString(importPaths, id, cb);
    }

    // Handle an array of imports
    if (Array.isArray(importPaths)) {
        return ensureArray(importPaths, id, cb);
    }

    // Handle a key/value hash of imports
    return ensureHash(importPaths, id, cb);
}

export default ensure;
