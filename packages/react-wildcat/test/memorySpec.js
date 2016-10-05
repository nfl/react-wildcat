"use strict";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const eventEmitter = new (require("events").EventEmitter)();
const leak = [];

function LeakingFunction() {}

describe.only("memory", () => {
    const logger = {info: sinon.stub()};

    beforeEach(() => {
        const memory = require("../src/memory");
        memory(logger);
        sinon.spy(console, "info");
    });

    afterEach(() => {
        console.info.restore();
    });

    it("should log a stats event", (done) => {
        setInterval(() => {
            for (let i = 0; i < 10; i++) {
                console.log(leak);
                const str = `${i} leak`;
                leak.push(str);
                leak.push(LeakingFunction);
            }
        }, 1);
        setTimeout(() => {
            eventEmitter.emit("stats");
            expect(logger.info.callCount).to.equal(2);
            eventEmitter.emit("stats");
            expect(logger.info.callCount).to.equal(3);
            done();
        }, 2000);
    });

    it("should log a leak event", (done) => {
        // every second, this program "leaks" a little bit
        setInterval(() => {
            for (let i = 0; i < 999999; i++) {
                console.log(i);
                const str = `${i} leak`;
                leak.push(str);
                leak.push(LeakingFunction);
            }
        }, 1);
        setTimeout(() => {
            expect(logger.info.callCount).to.equal(2);
            done();
        }, 2000);
    });
});
