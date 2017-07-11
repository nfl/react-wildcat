export {asyncTestErrorHandler};

function asyncTestErrorHandler(e, done) {
    expect(e).to.be.undefined;
    done();
}
