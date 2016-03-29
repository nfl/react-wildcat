const fs = require("fs-extra");

const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const http = require("http");
const WebSocket = require("ws/lib/WebSocket.js");

module.exports = (stubs) => {
    "use strict";

    describe("startWebSocketServer", () => {
        it("starts a web socket server", (done) => {
            const startWebSocketServer = require("../../src/utils/startWebSocketServer");
            const webSocketServer = startWebSocketServer(stubs.exampleDir, {
                cache: {},
                server: http.createServer(),
                watchOptions: {
                    awaitWriteFinish: {
                        pollInterval: 100,
                        stabilityThreshold: 250
                    },
                    ignored: /\.(git|gz|map)|node_modules|jspm_packages|src/,
                    ignoreInitial: true,
                    persistent: true
                }
            });

            expect(webSocketServer)
                .to.exist;

            expect(webSocketServer)
                .to.be.an("object");

            expect(webSocketServer)
                .to.have.property("watcher")
                .that.is.an("object");

            expect(webSocketServer)
                .to.have.property("server")
                .that.is.an("object");

            webSocketServer.watcher.on("ready", () => {
                Object.keys(webSocketServer).forEach(service => {
                    webSocketServer[service].close();
                });

                done();
            });
        });

        [{
            name: "with a fresh cache",
            cache: {}
        }, {
            name: "with a cached file",
            cache: {
                [stubs.mainEntryAbsTranspiledPath]: {}
            }
        }].forEach(test => {
            it(`responds to file changes ${test.name}`, (done) => {
                fs.outputFileSync(stubs.mainEntryAbsTranspiledPath, `module.exports = {};`, "utf8");

                const serverStub = http.createServer();
                const portStub = 9999;

                const startWebSocketServer = require("../../src/utils/startWebSocketServer");
                const webSocketServer = startWebSocketServer(stubs.exampleDir, {
                    cache: test.cache,
                    server: serverStub.listen(portStub),
                    watchOptions: {
                        awaitWriteFinish: {
                            pollInterval: 100,
                            stabilityThreshold: 250
                        },
                        ignored: /\.(git|gz|map)|node_modules|jspm_packages|src/,
                        ignoreInitial: true,
                        persistent: true
                    }
                });

                expect(webSocketServer)
                    .to.exist;

                expect(webSocketServer)
                    .to.be.an("object");

                expect(webSocketServer)
                    .to.have.property("watcher")
                    .that.is.an("object");

                expect(webSocketServer)
                    .to.have.property("server")
                    .that.is.an("object");

                webSocketServer.watcher.on("ready", () => {
                    const socket = new WebSocket(`ws://localhost:${portStub}`);

                    socket.addEventListener("open", () => {
                        fs.outputFileSync(stubs.mainEntryAbsTranspiledPath, `module.exports = {};`, "utf8");
                    });

                    socket.addEventListener("error", done);

                    socket.addEventListener("message", (messageEvent) => {
                        var message = JSON.parse(messageEvent.data);
                        var moduleName = message.data;

                        socket.close();

                        switch (message.event) {
                            case "filechange":
                                expect(moduleName)
                                    .to.be.a("string")
                                    .that.equals(stubs.mainEntryTranspiledPath);

                                setTimeout(() => {
                                    Object.keys(webSocketServer).forEach(service => {
                                        webSocketServer[service].close();
                                    });

                                    serverStub.close(() => done());
                                }, stubs.writeDelay);
                                break;

                            case "cacheflush":
                                expect(moduleName)
                                    .to.be.a("string")
                                    .that.equals(stubs.mainEntryAbsTranspiledPath);
                                break;
                        }
                    });
                });
            });
        });
    });
};
