const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const WebSocketServer = require("ws").Server;

module.exports = (stubs) => {
    "use strict";

    const port = 9876;
    const socketUrl = `ws://localhost:${port}`;

    let wss;
    let loggerInfoStub;

    before(() => {
        wss = new WebSocketServer({
            port
        });
    });

    after(() => {
        loggerInfoStub.restore();
        wss.close();
    });

    beforeEach(() => {
        loggerInfoStub = sinon.stub(stubs.logger, "info");
        loggerInfoStub.returns();
    });

    afterEach(() => {
        loggerInfoStub.restore();
    });

    describe("hotReloaderWebSocket", () => {
        it("opens a WebSocket", (done) => {
            const hotReloaderWebSocket = require("../../src/utils/hotReloaderWebSocket");

            const socket = hotReloaderWebSocket({}, socketUrl, stubs.logger);

            expect(socket)
                .to.exist;

            socket.addEventListener("open", () => {
                setTimeout(() => {
                    expect(loggerInfoStub.lastCall)
                        .to.have.been.calledWith(
                            `Listening to socket server at ${socketUrl}.`
                        );

                    socket.close();
                    done();
                }, stubs.writeDelay);
            });

            socket.addEventListener("error", done);
        });

        it("listens for incoming messages", (done) => {
            const hotReloaderWebSocket = require("../../src/utils/hotReloaderWebSocket");
            const onFileChangedStub = sinon.stub();

            const socket = hotReloaderWebSocket({
                onFileChanged: onFileChangedStub
            }, socketUrl, stubs.logger);

            expect(socket)
                .to.exist;

            socket.addEventListener("open", () => {
                wss.clients.forEach(function sendFileChange(client) {
                    client.send(JSON.stringify({
                        event: "filechange",
                        data: stubs.mainEntrySourcePath
                    }));
                });
            });

            socket.addEventListener("message", (messageEvent) => {
                var message = JSON.parse(messageEvent.data);

                expect(message)
                    .to.be.an("object");

                expect(message)
                    .to.have.property("event")
                    .that.equals("filechange");

                expect(message)
                    .to.have.property("data")
                    .that.equals(stubs.mainEntrySourcePath);

                setTimeout(() => {
                    expect(onFileChangedStub)
                        .to.have.been.calledWith(
                            stubs.mainEntrySourcePath
                        );

                    expect(loggerInfoStub.lastCall)
                        .to.have.been.calledWith(
                            `Listening to socket server at ${socketUrl}.`
                        );

                    socket.close();
                    done();
                }, stubs.writeDelay);
            });

            socket.addEventListener("error", done);
        });

        it("warns when an EADDRNOTAVAIL error occurs", (done) => {
            const wrongSocketUrl = `ws://localhost:0000`;

            const hotReloaderWebSocket = require("../../src/utils/hotReloaderWebSocket");
            const socket = hotReloaderWebSocket({}, wrongSocketUrl, stubs.logger);

            const loggerWarnStub = sinon.stub(stubs.logger, "warn");
            loggerWarnStub.returns();

            expect(socket)
                .to.exist;

            socket.addEventListener("error", (err) => {
                expect(err)
                    .to.exist;

                setTimeout(() => {
                    expect(loggerWarnStub.lastCall)
                        .to.have.been.calledWith(
                            `No socket server found at ${wrongSocketUrl}.`
                        );

                    loggerWarnStub.restore();
                    socket.close();
                    done();
                }, stubs.writeDelay);
            });
        });

        it("returns an error when any other socket error occurs", (done) => {
            const hotReloaderWebSocket = require("../../src/utils/hotReloaderWebSocket");
            const socket = hotReloaderWebSocket({}, socketUrl, stubs.logger);

            const loggerErrorStub = sinon.stub(stubs.logger, "error");
            loggerErrorStub.returns();

            expect(socket)
                .to.exist;

            socket.addEventListener("open", () => {
                socket.emit("error", stubs.errorStub);
            });

            socket.addEventListener("error", (err) => {
                expect(err)
                    .to.exist;

                expect(err)
                    .to.be.an.instanceof(Error);

                expect(err)
                    .to.equal(stubs.errorStub);

                setTimeout(() => {
                    expect(loggerErrorStub.lastCall)
                        .to.have.been.calledWith(
                            stubs.errorStub
                        );

                    expect(loggerInfoStub.lastCall)
                        .to.have.been.calledWith(
                            `Listening to socket server at ${socketUrl}.`
                        );

                    loggerErrorStub.restore();
                    socket.close();
                    done();
                }, stubs.writeDelay);
            });
        });
    });
};
