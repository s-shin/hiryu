"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usi_engine_1 = require("@hiryu/usi-engine");
const readline_1 = require("./readline");
function identity(v) {
    return v;
}
exports.DEFAULT_URL = "ws://127.0.0.1:3001";
class WebSocketAdapter extends usi_engine_1.EngineAdapter {
    constructor(opts = {}) {
        super();
        this.opts = opts;
    }
    start() {
        if (this.ws) {
            this.onError(new Error("already started"));
            return;
        }
        this.ws = new WebSocket(this.opts.url || exports.DEFAULT_URL, this.opts.protocols);
        const rl = readline_1.newDefaultReadLine();
        this.ws.onopen = () => {
            this.onReady();
        };
        this.ws.onerror = (e) => {
            this.onError(new Error(e.error.message));
        };
        this.ws.onmessage = e => {
            const onMessage = this.opts.hooks && this.opts.hooks.onMessage || identity;
            const onReadLine = this.opts.hooks && this.opts.hooks.onReadLine || identity;
            for (const line of rl(onMessage(e.data))) {
                this.onReadLine(onReadLine(line));
            }
        };
        this.ws.onclose = () => {
            this.onAfterExit();
            this.ws = undefined;
        };
    }
    writeln(line) {
        if (!this.ws) {
            this.onError(new Error("not started"));
            return;
        }
        const onWriteLine = this.opts.hooks && this.opts.hooks.onWriteLine || ((s) => `${s}\n`);
        this.ws.send(onWriteLine(line));
    }
    exit() {
        if (!this.ws) {
            this.onError(new Error("not stared"));
            return;
        }
        this.onBeforeExit();
        this.ws.close();
    }
}
exports.default = WebSocketAdapter;
//# sourceMappingURL=WebSocketAdapter.js.map