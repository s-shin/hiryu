"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usi_engine_1 = require("@hiryu/usi-engine");
const usi_engine_websocket_adapter_1 = __importDefault(require("@hiryu/usi-engine-websocket-adapter"));
const engine = new usi_engine_1.Engine(new usi_engine_websocket_adapter_1.default({
    hooks: {
        onMessage: data => data + "\n",
        onWriteLine: line => line,
    },
}));
engine.on("debug", msg => {
    console.log({ debug: msg });
});
engine.on("error", e => {
    console.error({ error: e });
});
engine.on("configure", opts => {
    console.log({ configure: opts });
    engine.newGame();
});
engine.on("info", info => {
    console.log({ info: info.string || info });
});
engine.on("ready", () => {
    console.log("!!! game is ready");
    engine.setGameState();
    engine.go();
});
engine.on("bestmove", move => {
    console.log(`!!! bestmove: ${move}`);
    engine.quit();
});
engine.start();
//# sourceMappingURL=main.js.map