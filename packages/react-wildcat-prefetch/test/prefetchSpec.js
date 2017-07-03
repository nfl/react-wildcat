const React = require("react");
const PropTypes = require("prop-types");
const ReactDOMServer = require("react-dom/server");
const Prefetch = require("../lib/index.js"); // eslint-disable-line import/default
const createReactClass = require("create-react-class");

const chai = require("chai");
const expect = chai.expect;

const stubs = require("./fixtures/stubData.js");

/* eslint-disable max-nested-callbacks, react/no-multi-comp */
describe("react-wildcat-prefetch", () => {
    describe("data hydration", () => {
        describe("hydration", () => {
            it("hydrates React components with server data", done => {
                const MemoryHydrationTest = createReactClass({
                    propTypes: {
                        asyncData: PropTypes.object
                    },

                    getDefaultProps() {
                        return {
                            asyncData: {}
                        };
                    },

                    render() {
                        expect(this.props.asyncData).to.eql(
                            stubs.prefetchedData.asyncData
                        );

                        return React.createElement(
                            "div",
                            null,
                            JSON.stringify(this.props.asyncData)
                        );
                    }
                });

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

                        expect(WrappedPrefetch.prefetch).to.have
                            .property(key)
                            .that.is.an("object")
                            .that.eql(stubs.prefetchedData.asyncData);

                        const markup = ReactDOMServer.renderToString(
                            React.createElement(WrappedPrefetch, null)
                        );

                        expect(markup).to.include("stub");

                        done();
                    })
                    .catch(e => done(e));
            });
        });
    });
});
