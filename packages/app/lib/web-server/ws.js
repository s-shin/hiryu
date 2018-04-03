"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const config_1 = __importDefault(require("config"));
const usi = __importStar(require("@hiryu/usi"));
const wsAPI = __importStar(require("../web-common/ws_api"));
const node_usi_1 = require("@hiryu/node-usi");
const logger_1 = require("./logger");
function setup(io) {
    io.on("connection", socket => {
        logger_1.logger.info(`new connection: ${socket.id}`);
        let engine;
        socket.on("error", (err) => {
            logger_1.logger.error(err);
        });
        socket.on("disconnect", (reason) => {
            logger_1.logger.info(`disconnect: ${reason}`);
            if (engine) {
                engine.quit();
                engine = undefined;
            }
        });
        socket.on(wsAPI.Name.REQ_NEW_GAME, (req, cb) => {
            if (engine) {
                cb({ error: { reason: "game already actived" } });
                return;
            }
            const engineConfigKey = `engines.${req.engine}`;
            if (!config_1.default.has(engineConfigKey)) {
                cb({ error: { reason: "unknown engine" } });
                return;
            }
            const engineConfig = config_1.default.get(engineConfigKey);
            engine = new node_usi_1.NodeEngineProcess(engineConfig.path.replace("$HOME", process_1.default.env.HOME || ""));
            engine.on("debug", (msg, ...args) => {
                logger_1.logger.debug(`engine: debug: ${msg}`, { args });
            });
            engine.on("configure", c => {
                logger_1.logger.info("engine: configure");
                if (!engine) {
                    // TODO: never come
                    return;
                }
                // TODO: set options
                engine.newGame();
            });
            engine.on("ready", () => {
                logger_1.logger.info("engine: ready");
                cb({});
            });
            engine.on("info", info => {
                logger_1.logger.info("engine: info");
                socket.emit(wsAPI.Name.NOTI_INFO, { info });
            });
            engine.on("bestmove", move => {
                logger_1.logger.info("engine: bestmove");
                socket.emit(wsAPI.Name.NOTI_BEST_MOVE, { move });
            });
            engine.on("error", err => {
                logger_1.logger.error(`engine: error: ${err}`);
                socket.emit(wsAPI.Name.NOTI_ERROR, { error: err });
            });
            engine.on("exit", () => {
                logger_1.logger.info("engine: exit");
                engine = undefined;
            });
            engine.start();
        });
        socket.on(wsAPI.Name.REQ_SET_GAME_STATE, (req, cb) => {
            if (!engine || engine.state !== usi.EngineState.IS_READY) {
                cb({ error: { reason: "engine is not ready" } });
                return;
            }
            engine.setGameState(req.state, req.moves);
            cb({});
        });
        socket.on(wsAPI.Name.REQ_GO, (req, cb) => {
            if (!engine || engine.state !== usi.EngineState.IS_READY) {
                cb({ error: { reason: "engine is not ready" } });
                return;
            }
            engine.go(req.options);
            cb({});
        });
        socket.on(wsAPI.Name.REQ_STOP, (req, cb) => {
            if (!engine || engine.state !== usi.EngineState.IS_READY) {
                cb({ error: { reason: "engine is not ready" } });
                return;
            }
            engine.stop();
            cb({});
        });
    });
}
exports.setup = setup;
//# sourceMappingURL=ws.js.map