"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_usi_1 = require("@hiryu/node-usi");
const eventemitter_util_1 = require("@hiryu/eventemitter-util");
const config_1 = require("./config");
class EngineProcessEntry {
    constructor(id, engineName, process, isLocked) {
        this.id = id;
        this.engineName = engineName;
        this.process = process;
        this.isLocked = isLocked;
    }
    toString() {
        return `EngineProcessEntry[${this.id}]`;
    }
}
exports.EngineProcessEntry = EngineProcessEntry;
class EngineProcessPool {
    constructor() {
        this.lastId = 0;
        this.entries = [];
    }
    aquire(engineName) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.mustBeSupportedEngine(engineName);
            const poolConfig = config_1.getEngineProcessPoolConfig(engineName);
            const targetEntries = this.entries.filter(entry => {
                return entry.engineName === engineName;
            });
            {
                const found = targetEntries.find(entry => {
                    return !entry.isLocked;
                });
                if (found) {
                    found.isLocked = true;
                    return found.process;
                }
            }
            if (targetEntries.length < poolConfig.limit) {
                const entry = yield this.createEntry(engineName);
                entry.isLocked = true;
                return entry.process;
            }
        });
    }
    release(engineProcess) {
        const found = this.entries.find(entry => {
            return entry.process === engineProcess;
        });
        if (!found) {
            return;
        }
        found.isLocked = false;
    }
    createEntry(engineName) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.mustBeSupportedEngine(engineName);
            const engineConfig = config_1.getEngineConfig(engineName);
            const engineProcess = new node_usi_1.NodeEngineProcess(config_1.pathFilter(engineConfig.path));
            const newEntry = new EngineProcessEntry(++this.lastId, engineName, engineProcess, true);
            this.entries.push(newEntry);
            engineProcess.on("exit", () => {
                this.entries = this.entries.filter(entry => {
                    return entry !== newEntry;
                });
            });
            engineProcess.on("debug", msg => {
                console.log(`${newEntry}: debug: ${msg}`);
            });
            const listenerPool = new eventemitter_util_1.EventListenerPool();
            try {
                yield new Promise((resolve, reject) => {
                    listenerPool.listen(engineProcess, "error", (err) => {
                        console.log(`${newEntry}: error: ${err}`);
                        reject(err);
                    });
                    listenerPool.listen(engineProcess, "configure", () => {
                        engineProcess.newGame();
                    });
                    listenerPool.listen(engineProcess, "ready", () => {
                        resolve();
                    });
                    engineProcess.start();
                });
            }
            catch (e) {
                console.error(e);
                throw e;
            }
            finally {
                listenerPool.dispose();
            }
            newEntry.isLocked = false;
            return newEntry;
        });
    }
}
exports.EngineProcessPool = EngineProcessPool;
exports.engineProcessPool = new EngineProcessPool();
//# sourceMappingURL=engine_process_pool.js.map