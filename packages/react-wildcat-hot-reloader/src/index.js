// Ported from https://github.com/capaj/systemjs-hot-reloader
// TODO: Contribute fixes back upstream

"use strict";

var ExecutionEnvironment = require("exenv");
var debug = require("debug");
var d = debug("jspm-hot-reloader");

function HotReloader(customLoader) {
    this.Loader = customLoader || System;
    this.originalImportFn = this.Loader.import;

    return this.init();
}

HotReloader.prototype = {
    init: function init() {
        var self = this;

        self.clientImportedModules = [];

        self.Loader.import = function customImport() {
            var args = arguments;
            self.clientImportedModules.push(args[0]);

            return self.originalImportFn.apply(
                self.Loader, arguments
            ).catch(
                function customImportError(err) {
                    self.lastFailedImport = args;
                    throw err;
                }
            );
        };

        self.pushImporters(self.Loader.loads);
    },

    clearFailedImportAttempt: function clearFailedImportAttempt(moduleToClear) {
        var self = this;

        var failedModuleDependencies = self.Loader.failed
            .filter(function filterFailedModules(failure) {
                return failure.name === moduleToClear;
            })
            .map(function mapFailedDependencies(failure) {
                return failure.dependencies.filter(function filterFailedDependencies(failedDependency) {
                    return self.Loader.failed.some(function matchFailedDependency(f) {
                        return f.name === failedDependency.value;
                    });
                });
            })[0];

        failedModuleDependencies.forEach(function withFailedDependency(failedDependency) {
            var normalizedDependencyName = failedDependency.value;

            // SystemJS doesn't register failures as defined modules
            // so we have to manually remove them
            if (self.Loader._loader.moduleRecords[normalizedDependencyName]) {
                delete self.Loader._loader.moduleRecords[normalizedDependencyName];
            }

            if (self.Loader.defined[normalizedDependencyName]) {
                delete self.Loader.defined[normalizedDependencyName];
            }
        });
    },

    onFileChanged: function onFileChanged(moduleName) {
        var self = this;

        if (ExecutionEnvironment.canUseDOM && moduleName === "index.html") {
            document.location.reload(true);
        } else {
            if (self.lastFailedImport) { // for wehn inital CustomLoader.import fails
                self.clearFailedImportAttempt.apply(self, self.lastFailedImport);

                return self.originalImportFn.apply(
                    self.Loader, self.lastFailedImport
                ).then(
                    function onFailedImport() {
                        self.lastFailedImport = null;
                    }
                );
            }

            if (self.currentHotReload) {
                self.currentHotReload = self.currentHotReload.then(
                    function onHotReload() {
                        // chain promises TODO we can solve this better- this often leads to the same module being reloaded mutliple times
                        return self.hotReload(moduleName);
                    }
                );
            } else if (self.failedReimport) {
                self.reImportRootModules(self.failedReimport, new Date());
            } else {
                self.currentHotReload = self.hotReload(moduleName);
            }
        }
    },

    pushImporters: function pushImporters(moduleMap, overwriteOlds) {
        var self = this;

        if (!moduleMap) {
            return;
        }

        Object.keys(moduleMap).forEach(function cacheImporters(moduleName) {
            var mod = self.Loader.loads[moduleName];

            if (!mod.importers) {
                mod.importers = [];
            }

            mod.deps.forEach(function cacheDependantImporters(dependantName) {
                var normalizedDependantName = mod.depMap[dependantName];
                var dependantMod = self.Loader.loads[normalizedDependantName];

                if (!dependantMod) {
                    return;
                }

                if (!dependantMod.importers) {
                    dependantMod.importers = [];
                }

                if (overwriteOlds) {
                    var imsIndex = dependantMod.importers.length;

                    while (imsIndex--) {
                        if (dependantMod.importers[imsIndex].name === mod.name) {
                            dependantMod.importers[imsIndex] = mod;
                            return;
                        }
                    }
                }

                dependantMod.importers.push(mod);
            });
        });
    },

    deleteModule: function deleteModule(moduleToDelete, from) {
        var self = this;
        var name = moduleToDelete.name;

        if (!self.modulesJustDeleted[name]) {
            var exportedValue;

            self.modulesJustDeleted[name] = moduleToDelete;

            if (!moduleToDelete.exports) {
                // this is a module from CustomLoader.loads
                exportedValue = self.Loader.get(name);

                if (!exportedValue) {
                    if (ExecutionEnvironment.canUseDOM) {
                        d(`missing exported value on ${name}, reloading whole page because module record is broken`);
                        document.location.reload(true);
                    }

                    return;
                }
            } else {
                exportedValue = moduleToDelete.exports;
            }
            if (typeof exportedValue.__unload === "function") {
                exportedValue.__unload(); // calling module unload hook
            }

            self.Loader.delete(name);
            d("deleted a module ", name, " because it has dependency on ", from);
        }
    },

    getModuleRecord: function getModuleRecord(moduleName) {
        var self = this;

        return self.Loader.normalize(moduleName).then(
            function onNormalize(normalizedName) {
                var aModule = self.Loader._loader.moduleRecords[normalizedName];

                if (!aModule) {
                    aModule = self.Loader.loads[normalizedName];

                    if (!aModule) {
                        return self.Loader.normalize(moduleName + "!").then(
                            function onNormalizeWithBang(normalizedNameWithBang) { // .jsx! for example are stored like this
                                aModule = self.Loader._loader.moduleRecords[normalizedNameWithBang];

                                if (aModule) {
                                    return aModule;
                                }

                                throw new Error("module was not found in Systemjs moduleRecords");
                            }
                        );
                    }
                }

                if (!aModule.importers) {
                    var importers = {};
                    importers[aModule.name] = aModule;

                    self.pushImporters(importers);
                }

                return aModule;
            }
        );
    },

    hotReload: function hotReload(moduleName) {
        var self = this;
        var start = new Date().getTime();

        self.modulesJustDeleted = {}; // TODO use weakmap

        return self.getModuleRecord(moduleName).then(
            function onModuleRecord(module) {
                self.deleteModule(module, "origin");
                var toReimport = [];

                function deleteAllImporters(mod) {
                    var importersToBeDeleted = mod.importers;

                    return importersToBeDeleted.map(function mapImporters(importer) {
                        if (self.modulesJustDeleted.hasOwnProperty(importer.name)) {
                            d("already deleted", importer.name);
                            return false;
                        }

                        self.deleteModule(importer, mod.name);

                        if (importer.importers.length === 0 && toReimport.indexOf(importer.name) === -1) {
                            toReimport.push(importer.name);
                            return true;
                        }

                        // recurse
                        var deleted = deleteAllImporters(importer);
                        return deleted;
                    });
                }

                if (module.importers.length === 0) {
                    toReimport.push(module.name);
                } else {
                    var deleted = deleteAllImporters(module);

                    if (deleted.find(function onFind(res) {
                        return res === false;
                    }) !== undefined) {
                        toReimport.push(module.name);
                    }
                }

                d("toReimport", toReimport);

                if (toReimport.length === 0) {
                    toReimport = self.clientImportedModules;
                }

                return self.reImportRootModules(toReimport, start);
            }
        ).catch(
            function onModuleError(err) {
                console.warn("moduleRecordNotFound", err);
                // not found any module for this file, not really an error
            }
        );
    },

    reImportRootModules: function reImportRootModules(toReimport, start) {
        var self = this;

        var promises = toReimport.map(function mapReimports(moduleName) {
            return self.originalImportFn.call(self.Loader, moduleName).then(
                function onReloadModule(moduleReloaded) {
                    if (typeof moduleReloaded.__reload === "function") {
                        var deletedModule = self.modulesJustDeleted[moduleName];
                        if (deletedModule !== undefined) {
                            moduleReloaded.__reload(deletedModule.exports); // calling module reload hook
                        }
                    }
                }
            );
        });

        return Promise.all(promises).then(
            function onImportPromise() {
                self.pushImporters(self.modulesJustDeleted, true);
                self.modulesJustDeleted = {};
                self.failedReimport = null;
                self.currentHotReload = null;

                d("all reimported in ", new Date().getTime() - start, "ms");
            }
        ).catch(
            function onImportError() {
                self.failedReimport = toReimport;
                self.currentHotReload = null;
            }
        );
    }
};

module.exports = HotReloader;
