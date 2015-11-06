import React from "react";
import ReactTestUtils from "react-addons-test-utils";
import Prefetch from "../../index.js"; // eslint-disable-line import/default

import Hello from "./fixtures/Hello.js";
import HelloES7 from "./fixtures/HelloES7.js";
import World from "./fixtures/World.js";

import * as stubs from "./fixtures/stubData.js";

/* eslint-disable max-nested-callbacks, react/no-multi-comp */
describe("react-wildcat-prefetch", () => {
    context("@prefetch", () => {
        context("plain React component", () => {
            it("has two properties", () => {
                const Component = ReactTestUtils.renderIntoDocument(<Hello title={"Test Title"}/>);
                expect(Object.keys(Component.props).length).to.equal(2);
            });

            it("has a static method", () => {
                expect(Hello.staticMethod).to.be.a("function");
                expect(Hello.staticMethod()).to.equal(42);
            });
        });

        context("higher-order component", () => {
            let WrappedPrefetch;

            context("es5", () => {
                beforeEach(() => {
                    WrappedPrefetch = Prefetch(stubs.fetchPromise)(World);
                });

                it("adds static methods to the component", () => {
                    expect(WrappedPrefetch.prefetch).to.exist;

                    expect(WrappedPrefetch.prefetch).to.respondTo("run");
                    expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                    expect(WrappedPrefetch.prefetch.getKey()).to.equal("asyncData");

                    WrappedPrefetch = Prefetch(stubs.fetchPromise, "newkey")(World);
                    expect(WrappedPrefetch.prefetch.getKey()).to.equal("newkey");
                });

                it("inherits static members", () => {
                    expect(WrappedPrefetch)
                        .itself.to.respondTo("staticMethod");

                    expect(WrappedPrefetch.staticMethod)
                        .to.be.a("function");

                    expect(WrappedPrefetch.staticMethod())
                        .to.equal(42);
                });
            });

            context("es6", () => {
                beforeEach(() => {
                    WrappedPrefetch = Prefetch(stubs.fetchPromise)(Hello);
                });

                it("adds static methods to the component", () => {
                    expect(WrappedPrefetch.prefetch).to.exist;

                    expect(WrappedPrefetch.prefetch).to.respondTo("run");
                    expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                    expect(WrappedPrefetch.prefetch.getKey()).to.equal("asyncData");

                    WrappedPrefetch = Prefetch(stubs.fetchPromise, "newkey")(Hello);
                    expect(WrappedPrefetch.prefetch.getKey()).to.equal("newkey");
                });

                it("inherits static members", () => {
                    expect(WrappedPrefetch)
                        .itself.to.respondTo("staticMethod");

                    expect(WrappedPrefetch.staticMethod)
                        .to.be.a("function");

                    expect(WrappedPrefetch.staticMethod())
                        .to.equal(42);
                });
            });

            context("es7", () => {
                beforeEach(() => {
                    WrappedPrefetch = Prefetch(stubs.fetchPromise)(HelloES7);
                });

                it("adds static methods to the component", () => {
                    expect(WrappedPrefetch.prefetch).to.exist;

                    expect(WrappedPrefetch.prefetch).to.respondTo("run");
                    expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                    expect(WrappedPrefetch.prefetch.getKey()).to.equal("asyncData");

                    WrappedPrefetch = Prefetch(stubs.fetchPromise, "newkey")(Hello);
                    expect(WrappedPrefetch.prefetch.getKey()).to.equal("newkey");
                });

                it("inherits static members", () => {
                    expect(WrappedPrefetch)
                        .itself.to.respondTo("staticMethod");

                    expect(WrappedPrefetch.staticMethod)
                        .to.be.a("function");

                    expect(WrappedPrefetch.staticMethod())
                        .to.equal(42);
                });
            });
        });
    });

    context("data fetching", () => {
        let WrappedPrefetch;

        beforeEach(() => {
            WrappedPrefetch = Prefetch(stubs.fetchPromise)(World);
        });

        it("fetches data using a Promise", (done) => {
            expect(WrappedPrefetch.prefetch)
                .to.exist;

            expect(WrappedPrefetch.prefetch)
                .to.respondTo("run");

            const runner = WrappedPrefetch.prefetch.run()
                .then((response) => {
                    expect(response)
                        .to.be.an("object")
                        .that.equals(stubs.prefetchedData);

                    done();
                });

            expect(runner)
                .to.be.an.instanceof(Promise);
        });

        it("fetches data from a url", (done) => {
            WrappedPrefetch = Prefetch(stubs.prefetchUrl)(World);

            expect(WrappedPrefetch.prefetch)
                .to.exist;

            expect(WrappedPrefetch.prefetch)
                .to.respondTo("run");

            const runner = WrappedPrefetch.prefetch.run()
                .then((response) => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.keys([
                            "currentReleaseText",
                            "teams",
                            "superBowls"
                        ]);

                    done();
                });

            expect(runner)
                .to.be.an.instanceof(Promise);
        });

        it("returns error payload on an invalid url", (done) => {
            WrappedPrefetch = Prefetch(stubs.prefetchInvalidUrl)(World);

            expect(WrappedPrefetch.prefetch)
                .to.exist;

            expect(WrappedPrefetch.prefetch)
                .to.respondTo("run");

            const runner = WrappedPrefetch.prefetch.run()
                .then((response) => {
                    expect(response)
                        .to.be.an("object")
                        .that.has.property("error");

                    done();
                });

            expect(runner)
                .to.be.an.instanceof(Promise);
        });

        it("throws an invariant on an invalid configuration", () => {
            const stubErrorHandler = () => Prefetch(null)(World);
            expect(stubErrorHandler).to.throw(Error, /Invariant Violation/);
        });

        it("exposes run static method", (done) => {
            expect(WrappedPrefetch.prefetch)
                .to.exist;

            expect(WrappedPrefetch.prefetch)
                .to.respondTo("run");

            const runner = WrappedPrefetch.prefetch.run()
                .then((response) => {
                    expect(response)
                        .to.be.an("object")
                        .that.equals(stubs.prefetchedData);

                    done();
                });

            expect(runner)
                .to.be.an.instanceof(Promise);
        });

        it("exposes getKey static method", () => {
            expect(WrappedPrefetch.prefetch)
                .to.exist;

            expect(WrappedPrefetch.prefetch)
                .to.respondTo("getKey");

            const key = WrappedPrefetch.prefetch.getKey();

            expect(key)
                .to.equal("asyncData");
        });

        context("unique key", () => {
            it("as string", () => {
                WrappedPrefetch = Prefetch(stubs.fetchPromise, stubs.prefetchedDataKey)(World);

                expect(WrappedPrefetch.prefetch)
                    .to.exist;

                expect(WrappedPrefetch.prefetch)
                    .to.respondTo("getKey");

                const key = WrappedPrefetch.prefetch.getKey();

                expect(key)
                    .to.equal(stubs.prefetchedDataKey);
            });

            it("as key / value", () => {
                WrappedPrefetch = Prefetch(stubs.fetchPromise, {
                    key: stubs.prefetchedDataKey
                })(World);

                expect(WrappedPrefetch.prefetch)
                    .to.exist;

                expect(WrappedPrefetch.prefetch)
                    .to.respondTo("getKey");

                const key = WrappedPrefetch.prefetch.getKey();

                expect(key)
                    .to.equal(stubs.prefetchedDataKey);
            });
        });
    });

    context("data hydration", () => {
        context("hydration", () => {
            before(() => {
                document.body.innerHTML = stubs.defaultTemplate({
                    data: stubs.prefetchedData,
                    head: {
                        title: "<title></title>",
                        meta: "",
                        link: ""
                    },
                    html: "",
                    wildcatConfig: stubs.wildcatConfig
                });

                window[stubs.__REACT_ROOT_ID__] = stubs.wildcatConfig.clientSettings.reactRootElementID;
                window[stubs.__INITIAL_DATA__] = stubs.prefetchedData;
            });

            it("hydrates React components with server data", (done) => {
                class WindowHydrationTest extends React.Component {
                    static propTypes = {
                        asyncData: React.PropTypes.object
                    }

                    static defaultProps = {
                        asyncData: {}
                    }

                    render() {
                        expect(this.props.asyncData)
                            .to.equal(stubs.prefetchedData);

                        done();

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(stubs.fetchPromise)(WindowHydrationTest);
                ReactTestUtils.renderIntoDocument(<WrappedPrefetch title={"Test Title"} />);
            });

            it("hydrates React components with memory data", (done) => {
                class MemoryHydrationTest extends React.Component {
                    static propTypes = {
                        asyncData: React.PropTypes.object
                    }

                    static defaultProps = {
                        asyncData: {}
                    }

                    render() {
                        expect(this.props.asyncData)
                            .to.equal(stubs.prefetchedData);

                        done();

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(stubs.fetchPromise)(MemoryHydrationTest);

                expect(WrappedPrefetch)
                    .to.have.property("prefetch");

                expect(WrappedPrefetch.prefetch)
                    .to.respondTo("run");

                WrappedPrefetch.prefetch.run()
                    .then(props => {
                        expect(WrappedPrefetch.prefetch)
                            .to.respondTo("getKey");

                        const key = WrappedPrefetch.prefetch.getKey();
                        WrappedPrefetch.prefetch[key] = props;

                        ReactTestUtils.renderIntoDocument(<WrappedPrefetch title={"Test Title"} />);
                    });
            });

            after(() => {
                window[stubs.__INITIAL_DATA__] = null;
                delete window[stubs.__INITIAL_DATA__];
            });
        });

        context("rehydration", () => {
            it("rehydrates React components", (done) => {
                let renderCount = 1;

                class RehydrationTest extends React.Component {
                    static propTypes = {
                        asyncData: React.PropTypes.object
                    }

                    render() {
                        if (renderCount === 1) {
                            expect(this.props.asyncData)
                                .to.be.undefined;

                            renderCount += 1;
                        } else {
                            expect(this.props.asyncData)
                                .to.equal(stubs.prefetchedData);

                            done();
                        }

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(stubs.fetchPromise)(RehydrationTest);
                ReactTestUtils.renderIntoDocument(<WrappedPrefetch title={"Test Title"} />);
            });
        });
    });
});
