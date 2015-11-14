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
    const normalizedImport = getNormalizedName(importPath, id);

    if (hasCachedModule(normalizedImport)) {
        return cb(null, getCachedModule(normalizedImport));
    }

    return System.import(normalizedImport)
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
            .map(normalizedImport => {
                if (hasCachedModule(normalizedImport)) {
                    return Promise.resolve(getCachedModule(normalizedImport));
                }

                return System.import(normalizedImport);
            })
    )
        .then(importedModules => cb(null, importedModules))
        .catch(e => cb(e));
}

function ensureHash(importPaths, id, cb) {
    const importPathKeys = Object.keys(importPaths);
    const moduleHashCache = {};

    const normalizedImports = importPathKeys
        .map(importPath => getNormalizedName(importPaths[importPath], id));

    const cachedImports = normalizedImports
        .map(normalizedImport => getCachedModule(normalizedImport))
        .filter(normalizedImport => normalizedImport);

    if (cachedImports.length === normalizedImports.length) {
        importPathKeys.forEach((importPathKey, idx) => {
            moduleHashCache[importPathKey] = cachedImports[idx];
        });

        return cb(null, moduleHashCache);
    }

    return Promise.all(
        normalizedImports
            .map(normalizedImport => {
                if (hasCachedModule(normalizedImport)) {
                    return Promise.resolve(getCachedModule(normalizedImport));
                }

                return System.import(normalizedImport);
            })
    )
        .then(importedModules => {
            importPathKeys
                .forEach((importPathKey, idx) => {
                    const importedModule = importedModules[idx];
                    moduleHashCache[importPathKey] = importedModule;
                });

            return cb(null, moduleHashCache);
        })
        .catch(e => cb(e));
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
