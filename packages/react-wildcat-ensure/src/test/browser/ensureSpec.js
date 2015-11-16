import ensure from "../../index.js"; // eslint-disable-line import/default, import/named
import {path, getComponent, getIndexRoute} from "./fixtures/routes.js";
import {
    getChildRoutes as getComponentsUsingMixedArray,
    getComponents as getComponentsUsingArray
} from "./fixtures/routesArray.js";
import {
    getChildRoutes as getComponentsUsingMixedHash,
    getComponents as getComponentsUsingHash
} from "./fixtures/routesHash.js";

import {getComponent as getMissingComponent} from "./fixtures/routesMissing.js";
import {getComponents as getMissingComponentsUsingHash} from "./fixtures/routesMissingHash.js";
import {getComponents as getMissingComponentsUsingArray} from "./fixtures/routesMissingArray.js";

/* eslint-disable max-nested-callbacks, react/no-multi-comp */
describe("react-wildcat-ensure", () => {
    it("exists", () => {
        expect(ensure)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("ensure");

        expect(path)
            .to.be.a("string");

        expect(getComponent)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("getComponent");

        expect(getComponentsUsingArray)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("getComponents");

        expect(getComponentsUsingHash)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("getComponents");
    });

    context("import", () => {
        context("single import", () => {
            it("asynchronously imports a module", (done) => {
                getComponent(location, (err, importedModule) => {
                    expect(err)
                        .to.not.exist;

                    expect(importedModule)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("AsyncExampleOne");

                    done();
                });
            });

            it("returns a cached module on subsequent requests", (done) => {
                getComponent(location, (err, importedModule) => {
                    expect(err)
                        .to.not.exist;

                    expect(importedModule)
                        .to.be.a("function")
                        .that.has.property("name")
                        .that.equals("AsyncExampleOne");

                    done();
                });
            });

            it("handles multiple individual asynchronous imports per module", (done) => {
                Promise.all([
                    new Promise((resolve, reject) => getComponent(location, (err, importedModule) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(importedModule);
                    })),
                    new Promise((resolve, reject) => getIndexRoute(location, (err, importedModule) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(importedModule);
                    }))
                ])
                    .then(([component, indexRoute]) => {
                        expect(component)
                            .to.be.a("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleOne");

                        expect(indexRoute)
                            .to.be.a("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleIndex");

                        done();
                    })
                    .catch(e => done(e));
            });
        });

        context("multiple imports", () => {
            context("as key/value hash", () => {
                it("asynchronously imports multiple modules", (done) => {
                    getComponentsUsingHash(location, (err, importedModules) => {
                        expect(err)
                            .to.not.exist;

                        expect(importedModules)
                            .to.exist;

                        expect(importedModules)
                            .to.be.an("object")
                            .that.has.keys([
                                "one",
                                "two"
                            ]);

                        expect(importedModules.one)
                            .to.be.an("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleOne");

                        expect(importedModules.two)
                            .to.be.an("object")
                            .that.has.property("AsyncExampleTwo")
                            .that.is.a("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleTwo");

                        done();
                    });
                });

                it("handles a mixed hash of cached / uncached modules", (done) => {
                    getComponentsUsingMixedHash(location, (err, importedModules) => {
                        expect(err)
                            .to.not.exist;

                        expect(importedModules)
                            .to.exist;

                        expect(importedModules)
                            .to.be.an("object")
                            .that.has.keys([
                                "one",
                                "two"
                            ]);

                        expect(importedModules.one)
                            .to.be.an("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleOne");

                        expect(importedModules.two)
                            .to.be.an("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleMixed");

                        done();
                    });
                });

                it("returns cached modules on subsequent requests", (done) => {
                    getComponentsUsingHash(location, (err, importedModules) => {
                        expect(err)
                            .to.not.exist;

                        expect(importedModules)
                            .to.exist;

                        expect(importedModules)
                            .to.be.an("object")
                            .that.has.keys([
                                "one",
                                "two"
                            ]);

                        expect(importedModules.one)
                            .to.be.an("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleOne");

                        expect(importedModules.two)
                            .to.be.an("object")
                            .that.has.property("AsyncExampleTwo")
                            .that.is.a("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleTwo");

                        done();
                    });
                });
            });

            context("as array", () => {
                it("asynchronously imports multiple modules", (done) => {
                    getComponentsUsingArray(location, (err, importedModules) => {
                        expect(err)
                            .to.not.exist;

                        expect(importedModules)
                            .to.exist;

                        expect(importedModules)
                            .to.be.an("array")
                            .that.has.length.of(2);

                        expect(importedModules[0])
                            .to.be.an("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleOne");

                        expect(importedModules[1])
                            .to.be.an("object")
                            .that.has.property("AsyncExampleTwo")
                            .that.is.a("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleTwo");

                        done();
                    });
                });

                it("handles a mixed array of cached / uncached modules", (done) => {
                    getComponentsUsingMixedArray(location, (err, importedModules) => {
                        expect(err)
                            .to.not.exist;

                        expect(importedModules)
                            .to.exist;

                        expect(importedModules)
                            .to.be.an("array")
                            .that.has.length.of(2);

                        expect(importedModules[0])
                            .to.be.an("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleOne");

                        expect(importedModules[1])
                            .to.be.an("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleMixed");

                        done();
                    });
                });

                it("returns cached modules on subsequent requests", (done) => {
                    getComponentsUsingArray(location, (err, importedModules) => {
                        expect(err)
                            .to.not.exist;

                        expect(importedModules)
                            .to.exist;

                        expect(importedModules)
                            .to.be.an("array")
                            .that.has.length.of(2);

                        expect(importedModules[0])
                            .to.be.an("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleOne");

                        expect(importedModules[1])
                            .to.be.an("object")
                            .that.has.property("AsyncExampleTwo")
                            .that.is.a("function")
                            .that.has.property("name")
                            .that.equals("AsyncExampleTwo");

                        done();
                    });
                });
            });
        });

        context("sad path", () => {
            it("handles error on single module", (done) => {
                getMissingComponent(location, (err, importedModule) => {
                    expect(err)
                        .to.exist;

                    expect(importedModule)
                        .to.not.exist;

                    expect(err)
                        .to.be.an.instanceof(Error)
                        .that.has.property("message")
                        .that.contains("404 Not Found");

                    done();
                });
            });

            it("handles error on a key/value hash of modules", (done) => {
                getMissingComponentsUsingHash(location, (err, importedModules) => {
                    expect(err)
                        .to.exist;

                    expect(importedModules)
                        .to.not.exist;

                    expect(err)
                        .to.be.an.instanceof(Error)
                        .that.has.property("message")
                        .that.contains("404 Not Found");

                    done();
                });
            });

            it("handles error on an array of modules", (done) => {
                getMissingComponentsUsingArray(location, (err, importedModules) => {
                    expect(err)
                        .to.exist;

                    expect(importedModules)
                        .to.not.exist;

                    expect(err)
                        .to.be.an.instanceof(Error)
                        .that.has.property("message")
                        .that.contains("404 Not Found");

                    done();
                });
            });
        });
    });
});
