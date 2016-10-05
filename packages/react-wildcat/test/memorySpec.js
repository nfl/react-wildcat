"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const memwatch = require("memwatch-next");

describe("memory", () => {
    let logger = {info: sinon.stub()};
    beforeEach(() => {
        const memory = require("../src/memory");
        memory(logger);
    });

    afterEach(() => {
        logger = {info: sinon.stub()};
    });

    it("should log a stats event", (done) => {
        memwatch.emit("stats");
        expect(logger.info.callCount).to.equal(3);
        done();

        setTimeout(() => {
            memwatch.emit("stats");
            expect(logger.info.callCount).to.equal(4);
            done();
        }, 1);
    });

    it("should log a leak event", (done) => {
        memwatch.emit("leak");
        setTimeout(() => {
            expect(logger.info.callCount).to.equal(2);
            done();
        }, 1);
    });
});
