import React from "react";
import PropTypes from "prop-types";
import ReactTestUtils from "react-addons-test-utils";
import Prefetch from "../../index.js"; // eslint-disable-line import/default

import Hello from "./fixtures/Hello.js";
import HelloES7 from "./fixtures/HelloES7.js";
import World from "./fixtures/World.js";
import CustomPrefetchStatic from "./fixtures/CustomPrefetchStatic.js";
import DefaultPrefetchStatic from "./fixtures/DefaultPrefetchStatic.js";

import sinon from "sinon";
import * as stubs from "./fixtures/stubData.js";

import {expect} from "chai";

/* eslint-disable max-nested-callbacks, react/no-multi-comp */
describe("react-wildcat-prefetch", () => {
    describe("@prefetch", () => {
        describe("plain React component", () => {
            it("has two properties", () => {
                const Component = ReactTestUtils.renderIntoDocument(
                    <Hello title={"Test Title"} />
                );
                expect(Object.keys(Component.props).length).to.equal(2);
            });

            it("has a static method", () => {
                expect(Hello.staticMethod).to.be.a("function");
                expect(Hello.staticMethod()).to.equal(42);
            });
        });

        describe("higher-order component", () => {
            let WrappedPrefetch;

            describe("es5", () => {
                beforeEach(() => {
                    WrappedPrefetch = Prefetch(stubs.fetchPromise)(World);
                });

                it("adds static methods to the component", () => {
                    expect(WrappedPrefetch.prefetch).to.exist;

                    expect(WrappedPrefetch.prefetch).to.respondTo("run");
                    expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                    expect(WrappedPrefetch.prefetch.getKey()).to.equal(
                        "asyncData"
                    );

                    WrappedPrefetch = Prefetch(stubs.fetchPromise, "newkey")(
                        World
                    );
                    expect(WrappedPrefetch.prefetch.getKey()).to.equal(
                        "newkey"
                    );
                });

                it("inherits static members", () => {
                    expect(WrappedPrefetch).itself.to.respondTo("staticMethod");

                    expect(WrappedPrefetch.staticMethod).to.be.a("function");

                    expect(WrappedPrefetch.staticMethod()).to.equal(42);
                });
            });

            describe("es6", () => {
                beforeEach(() => {
                    WrappedPrefetch = Prefetch(stubs.fetchPromise)(Hello);
                });

                it("adds static methods to the component", () => {
                    expect(WrappedPrefetch.prefetch).to.exist;

                    expect(WrappedPrefetch.prefetch).to.respondTo("run");
                    expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                    expect(WrappedPrefetch.prefetch.getKey()).to.equal(
                        "asyncData"
                    );

                    WrappedPrefetch = Prefetch(stubs.fetchPromise, "newkey")(
                        Hello
                    );
                    expect(WrappedPrefetch.prefetch.getKey()).to.equal(
                        "newkey"
                    );
                });

                it("inherits static members", () => {
                    expect(WrappedPrefetch).itself.to.respondTo("staticMethod");

                    expect(WrappedPrefetch.staticMethod).to.be.a("function");

                    expect(WrappedPrefetch.staticMethod()).to.equal(42);
                });
            });

            describe("es7", () => {
                beforeEach(() => {
                    WrappedPrefetch = Prefetch(stubs.fetchPromise)(HelloES7);
                });

                it("adds static methods to the component", () => {
                    expect(WrappedPrefetch.prefetch).to.exist;

                    expect(WrappedPrefetch.prefetch).to.respondTo("run");
                    expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                    expect(WrappedPrefetch.prefetch.getKey()).to.equal(
                        "asyncData"
                    );

                    WrappedPrefetch = Prefetch(stubs.fetchPromise, "newkey")(
                        Hello
                    );
                    expect(WrappedPrefetch.prefetch.getKey()).to.equal(
                        "newkey"
                    );
                });

                it("inherits static members", () => {
                    expect(WrappedPrefetch).itself.to.respondTo("staticMethod");

                    expect(WrappedPrefetch.staticMethod).to.be.a("function");

                    expect(WrappedPrefetch.staticMethod()).to.equal(42);
                });
            });
        });
    });

    describe("data fetching", () => {
        let WrappedPrefetch;

        beforeEach(() => {
            WrappedPrefetch = Prefetch(stubs.fetchPromise)(World);
        });

        describe("happy path", () => {
            beforeEach(() => {
                sinon.stub(window, "fetch");

                const res = new window.Response(
                    JSON.stringify(stubs.prefetchedData.asyncData),
                    {
                        status: 200,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                window.fetch.returns(Promise.resolve(res));
            });

            it("fetches data using a Promise", done => {
                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("run");

                const runner = WrappedPrefetch.prefetch
                    .run()
                    .then(response => {
                        expect(response).to.be
                            .an("object")
                            .that.equals(stubs.prefetchedData.asyncData);

                        done();
                    })
                    .catch(done);

                expect(runner).to.be.an.instanceof(Promise);
            });

            it("fetches data from a url", done => {
                WrappedPrefetch = Prefetch(stubs.prefetchUrl)(World);

                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("run");

                const runner = WrappedPrefetch.prefetch
                    .run()
                    .then(response => {
                        expect(response).to.be
                            .an("object")
                            .that.has.keys(stubs.prefetchedData.asyncData);

                        done();
                    })
                    .catch(done);

                expect(runner).to.be.an.instanceof(Promise);
            });

            it("fetches data from a custom static method", done => {
                WrappedPrefetch = Prefetch("customFetchData")(
                    CustomPrefetchStatic
                );

                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("run");

                const runner = WrappedPrefetch.prefetch
                    .run()
                    .then(response => {
                        expect(response).to.be
                            .a("number")
                            .that.equals(stubs.customFetchDataResponse);

                        done();
                    })
                    .catch(done);

                expect(runner).to.be.an.instanceof(Promise);
            });

            it("fetches data from default static method", done => {
                WrappedPrefetch = Prefetch(DefaultPrefetchStatic);

                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("run");

                const runner = WrappedPrefetch.prefetch
                    .run()
                    .then(response => {
                        expect(response).to.be
                            .a("number")
                            .that.equals(stubs.customFetchDataResponse);

                        done();
                    })
                    .catch(done);

                expect(runner).to.be.an.instanceof(Promise);
            });

            afterEach(() => {
                window.fetch.restore();
            });
        });

        describe("sad path", () => {
            it("returns error payload on an invalid url", done => {
                WrappedPrefetch = Prefetch(stubs.prefetchInvalidUrl)(World);

                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("run");

                const runner = WrappedPrefetch.prefetch
                    .run()
                    .then(response => {
                        expect(response).to.be
                            .an("object")
                            .that.has.property("error");

                        done();
                    })
                    .catch(done);

                expect(runner).to.be.an.instanceof(Promise);
            });

            it("throws an invariant on an invalid configuration", () => {
                const stubErrorHandler = () => Prefetch(null)(World);
                expect(stubErrorHandler).to.throw(
                    Error,
                    /Action must be typeof function or a string/
                );
            });
        });

        it("exposes run static method", done => {
            expect(WrappedPrefetch.prefetch).to.exist;

            expect(WrappedPrefetch.prefetch).to.respondTo("run");

            const runner = WrappedPrefetch.prefetch
                .run()
                .then(response => {
                    expect(response).to.be
                        .an("object")
                        .that.equals(stubs.prefetchedData.asyncData);

                    done();
                })
                .catch(done);

            expect(runner).to.be.an.instanceof(Promise);
        });

        it("exposes getKey static method", () => {
            expect(WrappedPrefetch.prefetch).to.exist;

            expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

            const key = WrappedPrefetch.prefetch.getKey();

            expect(key).to.equal("asyncData");
        });

        describe("unique key", () => {
            it("as string", () => {
                WrappedPrefetch = Prefetch(
                    stubs.fetchPromise,
                    stubs.prefetchedDataKey
                )(World);

                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                const key = WrappedPrefetch.prefetch.getKey();

                expect(key).to.equal(stubs.prefetchedDataKey);
            });

            it("as key / value", () => {
                WrappedPrefetch = Prefetch(stubs.fetchPromise, {
                    key: stubs.prefetchedDataKey
                })(World);

                expect(WrappedPrefetch.prefetch).to.exist;

                expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                const key = WrappedPrefetch.prefetch.getKey();

                expect(key).to.equal(stubs.prefetchedDataKey);
            });
        });
    });

    describe("data hydration", () => {
        describe("hydration", () => {
            beforeEach(() => {
                document.body.innerHTML = stubs.defaultTemplate({
                    data: stubs.prefetchedData,
                    head: {
                        htmlAttributes: "",
                        title: "<title></title>",
                        meta: "",
                        link: ""
                    },
                    html: "",
                    wildcatConfig: stubs.wildcatConfig
                });

                window[stubs.__REACT_ROOT_ID__] =
                    stubs.wildcatConfig.clientSettings.reactRootElementID;
                window[stubs.__INITIAL_DATA__] = {
                    ...stubs.prefetchedData
                };
            });

            it("hydrates React components with server data", done => {
                class WindowHydrationTest extends React.Component {
                    static propTypes = {
                        asyncData: PropTypes.object
                    };

                    static defaultProps = {
                        asyncData: {}
                    };

                    render() {
                        expect(this.props.asyncData).to.eql(
                            stubs.prefetchedData.asyncData
                        );

                        done();

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(stubs.fetchPromise)(
                    WindowHydrationTest
                );
                ReactTestUtils.renderIntoDocument(
                    <WrappedPrefetch title={"Test Title"} />
                );
            });

            it("hydrates React components with array data", done => {
                class ArrayHydrationTest extends React.Component {
                    static propTypes = {
                        asyncArrayData: PropTypes.array
                    };

                    static defaultProps = {
                        asyncArrayData: []
                    };

                    render() {
                        expect(this.props.asyncArrayData).to.eql(
                            stubs.prefetchedData.asyncArrayData
                        );

                        done();

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(
                    stubs.fetchPromise,
                    "asyncArrayData"
                )(ArrayHydrationTest);
                ReactTestUtils.renderIntoDocument(
                    <WrappedPrefetch title={"Test Title"} />
                );
            });

            it("hydrates multiple React components", done => {
                let renderCount = 1;

                class FirstHydrationTest extends React.Component {
                    static propTypes = {
                        firstData: PropTypes.object
                    };

                    static defaultProps = {
                        firstData: {}
                    };

                    render() {
                        expect(this.props.firstData).to.eql(
                            stubs.prefetchedData.firstData
                        );

                        if (renderCount > 1) {
                            done();
                        }

                        renderCount++;
                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                class SecondHydrationTest extends React.Component {
                    static propTypes = {
                        secondData: PropTypes.object
                    };

                    static defaultProps = {
                        secondData: {}
                    };

                    render() {
                        expect(this.props.secondData).to.eql(
                            stubs.prefetchedData.secondData
                        );

                        if (renderCount > 1) {
                            done();
                        }

                        renderCount++;
                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const FirstWrappedPrefetch = Prefetch(
                    stubs.fetchPromise,
                    "firstData"
                )(FirstHydrationTest);
                const SecondWrappedPrefetch = Prefetch(
                    stubs.fetchPromise,
                    "secondData"
                )(SecondHydrationTest);

                ReactTestUtils.renderIntoDocument(
                    <div>
                        <FirstWrappedPrefetch title={"Test Title"} />
                        <SecondWrappedPrefetch title={"Test Title"} />
                    </div>
                );
            });

            describe("setting a custom key", () => {
                beforeEach(() => {
                    document.body.innerHTML = stubs.defaultTemplate({
                        data: stubs.prefetchedData,
                        head: {
                            htmlAttributes: "",
                            title: "<title></title>",
                            meta: "",
                            link: ""
                        },
                        html: "",
                        wildcatConfig: stubs.wildcatConfig
                    });

                    window[stubs.__REACT_ROOT_ID__] =
                        stubs.wildcatConfig.clientSettings.reactRootElementID;
                    window[stubs.__INITIAL_DATA__] = {
                        ...stubs.prefetchedDataCustomKey
                    };
                });

                it("using a custom key as hash", done => {
                    class CustomKeyHydrationTest extends React.Component {
                        static propTypes = {
                            [stubs.prefetchedDataKey]: PropTypes.object
                        };

                        static defaultProps = {
                            [stubs.prefetchedDataKey]: {}
                        };

                        render() {
                            expect(this.props[stubs.prefetchedDataKey]).to.eql(
                                stubs.prefetchedDataCustomKey[
                                    stubs.prefetchedDataKey
                                ]
                            );

                            done();

                            return <div>{Object.keys(this.props)}</div>;
                        }
                    }

                    const WrappedPrefetch = Prefetch(
                        stubs.fetchPromiseCustomKey,
                        {
                            key: stubs.prefetchedDataKey
                        }
                    )(CustomKeyHydrationTest);
                    ReactTestUtils.renderIntoDocument(
                        <WrappedPrefetch title={"Test Title"} />
                    );
                });

                it("using a custom key as string", done => {
                    class CustomKeyHydrationTest extends React.Component {
                        static propTypes = {
                            [stubs.prefetchedDataKey]: PropTypes.object
                        };

                        static defaultProps = {
                            [stubs.prefetchedDataKey]: {}
                        };

                        render() {
                            expect(this.props[stubs.prefetchedDataKey]).to.eql(
                                stubs.prefetchedDataCustomKey[
                                    stubs.prefetchedDataKey
                                ]
                            );

                            done();

                            return <div>{Object.keys(this.props)}</div>;
                        }
                    }

                    const WrappedPrefetch = Prefetch(
                        stubs.fetchPromiseCustomKey,
                        stubs.prefetchedDataKey
                    )(CustomKeyHydrationTest);
                    ReactTestUtils.renderIntoDocument(
                        <WrappedPrefetch title={"Test Title"} />
                    );
                });
            });

            it("hydrates React components with memory data", done => {
                class MemoryHydrationTest extends React.Component {
                    static propTypes = {
                        asyncData: PropTypes.object
                    };

                    static defaultProps = {
                        asyncData: {}
                    };

                    render() {
                        expect(this.props.asyncData).to.eql(
                            stubs.prefetchedData.asyncData
                        );

                        done();

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(stubs.fetchPromise)(
                    MemoryHydrationTest
                );

                expect(WrappedPrefetch).to.have.property("prefetch");

                expect(WrappedPrefetch.prefetch).to.respondTo("run");

                WrappedPrefetch.prefetch
                    .run()
                    .then(props => {
                        expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                        const key = WrappedPrefetch.prefetch.getKey();
                        WrappedPrefetch.prefetch[key] = props;

                        ReactTestUtils.renderIntoDocument(
                            <WrappedPrefetch title={"Test Title"} />
                        );
                    })
                    .catch(done);
            });

            it("hydrates React components with server data", done => {
                class ServerHydrationTest extends React.Component {
                    static propTypes = {
                        asyncData: PropTypes.object
                    };

                    static defaultProps = {
                        asyncData: {}
                    };

                    render() {
                        expect(this.props.asyncData).to.eql(
                            stubs.prefetchedData.asyncData
                        );

                        done();

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(stubs.fetchPromise, {
                    canUseDOM: false
                })(ServerHydrationTest);

                expect(WrappedPrefetch).to.have.property("prefetch");

                expect(WrappedPrefetch.prefetch).to.respondTo("run");

                WrappedPrefetch.prefetch
                    .run()
                    .then(props => {
                        expect(WrappedPrefetch.prefetch).to.respondTo("getKey");

                        const key = WrappedPrefetch.prefetch.getKey();
                        WrappedPrefetch.prefetch[key] = props;

                        ReactTestUtils.renderIntoDocument(
                            <WrappedPrefetch title={"Test Title"} />
                        );
                    })
                    .catch(done);
            });

            afterEach(() => {
                window[stubs.__INITIAL_DATA__] = null;
                delete window[stubs.__INITIAL_DATA__];
            });
        });

        describe("rehydration", () => {
            it("rehydrates React components", done => {
                let renderCount = 1;

                class RehydrationTest extends React.Component {
                    static propTypes = {
                        asyncData: PropTypes.object
                    };

                    render() {
                        if (renderCount === 1) {
                            expect(this.props.asyncData).to.be.undefined;

                            renderCount++;
                        } else {
                            expect(this.props.asyncData).to.eql(
                                stubs.prefetchedData.asyncData
                            );

                            done();
                        }

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(stubs.fetchPromise)(
                    RehydrationTest
                );
                ReactTestUtils.renderIntoDocument(
                    <WrappedPrefetch title={"Test Title"} />
                );
            });

            it("rehydrates React components with array data", done => {
                let renderCount = 1;

                class ArrayRehydrationTest extends React.Component {
                    static propTypes = {
                        asyncArrayData: PropTypes.array
                    };

                    render() {
                        if (renderCount === 1) {
                            expect(this.props.asyncArrayData).to.be.undefined;

                            renderCount++;
                        } else {
                            expect(this.props.asyncArrayData).to.eql(
                                stubs.prefetchedData.asyncArrayData
                            );

                            done();
                        }

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const WrappedPrefetch = Prefetch(
                    stubs.arrayFetchPromise,
                    "asyncArrayData"
                )(ArrayRehydrationTest);
                ReactTestUtils.renderIntoDocument(
                    <WrappedPrefetch title={"Test Title"} />
                );
            });

            it("rehydrates multiple React components", done => {
                let firstRenderCount = 1;
                let secondRenderCount = 1;
                let totalRenderCount = 1;

                class FirstRehydrationTest extends React.Component {
                    static propTypes = {
                        firstData: PropTypes.object
                    };

                    static defaultProps = {
                        firstData: {}
                    };

                    render() {
                        if (firstRenderCount === 1) {
                            expect(this.props.firstData).to.eql({});

                            firstRenderCount++;
                        } else {
                            expect(this.props.firstData).to.eql(
                                stubs.prefetchedData.firstData
                            );

                            if (totalRenderCount > 1) {
                                done();
                            }

                            totalRenderCount++;
                        }

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                class SecondRehydrationTest extends React.Component {
                    static propTypes = {
                        secondData: PropTypes.object
                    };

                    static defaultProps = {
                        secondData: {}
                    };

                    render() {
                        if (secondRenderCount === 1) {
                            expect(this.props.secondData).to.eql({});

                            secondRenderCount++;
                        } else {
                            expect(this.props.secondData).to.eql(
                                stubs.prefetchedData.secondData
                            );

                            if (totalRenderCount > 1) {
                                done();
                            }

                            totalRenderCount++;
                        }

                        return <div>{Object.keys(this.props)}</div>;
                    }
                }

                const FirstWrappedPrefetch = Prefetch(
                    stubs.firstFetchPromise,
                    "firstData"
                )(FirstRehydrationTest);
                const SecondWrappedPrefetch = Prefetch(
                    stubs.secondFetchPromise,
                    "secondData"
                )(SecondRehydrationTest);

                ReactTestUtils.renderIntoDocument(
                    <div>
                        <FirstWrappedPrefetch title={"Test Title"} />
                        <SecondWrappedPrefetch title={"Test Title"} />
                    </div>
                );
            });
        });
    });
});
