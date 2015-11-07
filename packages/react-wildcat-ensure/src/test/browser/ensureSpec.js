import ensure, {__moduleCache} from "../../index.js"; // eslint-disable-line import/default, import/named
import {path, getComponent} from "./fixtures/routes.js";
import {getComponents as getComponentsUsingArray} from "./fixtures/routesArray.js";
import {getComponents as getComponentsUsingHash} from "./fixtures/routesHash.js";

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

        expect(__moduleCache)
            .to.be.an("object");

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
                getComponent(location, (err, module) => {
                    expect(err)
                        .to.not.exist;

                    expect(module)
                        .to.exist;

                    done();
                });
            });

            it("returns a cached module on subsequent requests", (done) => {
                getComponent(location, (err, module) => {
                    expect(err)
                        .to.not.exist;

                    expect(module)
                        .to.exist;

                    done();
                });
            });
        });

        context("multiple imports", () => {
            context("as key/value hash", () => {
                it("asynchronously imports multiple modules", (done) => {
                    getComponentsUsingHash(location, (err, modules) => {
                        expect(err)
                            .to.not.exist;

                        expect(modules)
                            .to.exist;

                        expect(modules)
                            .to.be.an("object")
                            .that.has.keys([
                                "one",
                                "two"
                            ]);

                        done();
                    });
                });

                it("returns cached modules on subsequent requests", (done) => {
                    getComponentsUsingHash(location, (err, modules) => {
                        expect(err)
                            .to.not.exist;

                        expect(modules)
                            .to.exist;

                        expect(modules)
                            .to.be.an("object")
                            .that.has.keys([
                                "one",
                                "two"
                            ]);

                        done();
                    });
                });
            });

            context("as array", () => {
                it("asynchronously imports multiple modules", (done) => {
                    getComponentsUsingArray(location, (err, modules) => {
                        expect(err)
                            .to.not.exist;

                        expect(modules)
                            .to.exist;

                        expect(modules)
                            .to.be.an("array")
                            .that.has.length.of(2);

                        done();
                    });
                });

                it("returns cached modules on subsequent requests", (done) => {
                    getComponentsUsingArray(location, (err, modules) => {
                        expect(err)
                            .to.not.exist;

                        expect(modules)
                            .to.exist;

                        expect(modules)
                            .to.be.an("array")
                            .that.has.length.of(2);

                        done();
                    });
                });
            });
        });

        context("sad path", () => {
            it("handles error on single module", (done) => {
                getMissingComponent(location, (err, module) => {
                    expect(err)
                        .to.exist;

                    expect(module)
                        .to.not.exist;

                    expect(err)
                        .to.be.an.instanceof(Error)
                        .that.has.property("message")
                        .that.contains("404 Not Found");

                    done();
                });
            });

            it("handles error on a key/value hash of modules", (done) => {
                getMissingComponentsUsingHash(location, (err, module) => {
                    expect(err)
                        .to.exist;

                    expect(module)
                        .to.not.exist;

                    expect(err)
                        .to.be.an.instanceof(Error)
                        .that.has.property("message")
                        .that.contains("404 Not Found");

                    done();
                });
            });

            it("handles error on an array of modules", (done) => {
                getMissingComponentsUsingArray(location, (err, modules) => {
                    expect(err)
                        .to.exist;

                    expect(modules)
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
