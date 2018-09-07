"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const readline = __importStar(require("readline"));
const usi_engine_1 = require("@hiryu/usi-engine");
class NodeEngineAdapter extends usi_engine_1.EngineAdapter {
    constructor(binPath) {
        super();
        this.binPath = binPath;
    }
    start() {
        if (this.process || this.rl) {
            this.onError(new Error("process is running"));
            return;
        }
        this.process = child_process_1.spawn(this.binPath);
        this.rl = readline.createInterface({
            input: this.process.stdout,
        });
        this.rl.on("line", (line) => {
            this.onReadLine(line);
        });
        this.process.on("error", (err) => {
            this.onError(err);
        });
        this.process.on("exit", (code, signal) => {
            this.process = undefined;
            this.rl = undefined;
            this.onAfterExit();
        });
        this.debug("process is ready");
        this.onReady();
    }
    writeln(line) {
        if (!this.process) {
            this.onError(new Error("process is not ready"));
            return;
        }
        this.process.stdin.write(`${line}\n`, "utf8");
    }
    exit() {
        if (!this.process) {
            this.onError(new Error("process is not ready"));
            return;
        }
        if (this.process.killed) {
            this.process = undefined;
            this.rl = undefined;
            return this.onAfterExit();
        }
        this.onBeforeExit();
        this.process.kill();
    }
}
exports.default = NodeEngineAdapter;
//# sourceMappingURL=NodeEngineAdapter.js.map