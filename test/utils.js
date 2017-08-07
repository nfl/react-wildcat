module.exports = asyncTestErrorHandler;

function asyncTestErrorHandler(e, done) {
    console.log(e);
    expect(e).to.be.undefined;
    done();
}
