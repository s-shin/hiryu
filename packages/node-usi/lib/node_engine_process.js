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
const usi_1 = require("@hiryu/usi");
class NodeEngineProcess extends usi_1.Engine {
    constructor(binPath) {
        super();
        this.process = child_process_1.spawn(binPath);
        this.rl = readline.createInterface({
            input: this.process.stdout,
        });
        this.rl.on("line", (line) => {
            this.parseLine(line);
        });
        this.process.on("error", (err) => {
            this.error(err);
        });
        this.process.on("exit", (code, signal) => {
            this.afterExit();
        });
        this.debug("process is ready");
        this.processStarted();
    }
    writeln(line) {
        this.process.stdin.write(`${line}\n`, "utf8");
    }
    exit() {
        if (this.process.killed) {
            return this.afterExit();
        }
        this.beforeExit();
        this.process.kill();
    }
}
exports.NodeEngineProcess = NodeEngineProcess;
//# sourceMappingURL=node_engine_process.js.map