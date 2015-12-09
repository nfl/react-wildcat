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
        .then(function ensureImport(importedModule) {
            return cb(null, importedModule);
        })
        .catch(function ensureError(e) {
            return cb(e);
        });
}

function ensureArray(importPaths, id, cb) {
    const normalizedImports = importPaths
        .map(function normalizedImportsMap(importPath) {
            return getNormalizedName(importPath, id);
        });

    const cachedImports = normalizedImports
        .map(function cachedImportsMap(normalizedImport) {
            return getCachedModule(normalizedImport);
        })
        .filter(function cachedImportsFilter(normalizedImport) {
            return normalizedImport;
        });

    if (cachedImports.length === normalizedImports.length) {
        return cb(null, cachedImports);
    }

    return Promise.all(
        normalizedImports
            .map(function normalizedImportsMap(normalizedImport) {
                return ensureString(normalizedImport, null, function ensureStringCallback(err, importedModules) {
                    if (err) {
                        return Promise.reject(err);
                    }

                    return Promise.resolve(importedModules);
                });
            })
    )
        .then(function normalizedImportsHandler(importedModules) {
            return cb(null, importedModules);
        })
        .catch(function normalizedImportsError(e) {
            return cb(e);
        });
}

function ensureHash(importPaths, id, cb) {
    const importPathKeys = Object.keys(importPaths);
    const moduleHashCache = {};

    importPaths = importPathKeys.map(function importPathsMap(importPath) {
        return importPaths[importPath];
    });

    return ensureArray(importPaths, id, function ensureArrayResult(err, importedModules) {
        if (err) {
            return cb(err);
        }

        importPathKeys
            .forEach(function importPathKey(importPath, idx) {
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
