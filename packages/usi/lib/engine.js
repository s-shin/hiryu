"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
var EngineState;
(function (EngineState) {
    EngineState[EngineState["NOT_STARTED"] = 0] = "NOT_STARTED";
    EngineState[EngineState["CHECK_USI"] = 1] = "CHECK_USI";
    EngineState[EngineState["SET_OPTIONS"] = 2] = "SET_OPTIONS";
    EngineState[EngineState["IS_READY"] = 3] = "IS_READY";
    EngineState[EngineState["IS_GOING"] = 4] = "IS_GOING";
    EngineState[EngineState["GAME_OVER"] = 5] = "GAME_OVER";
    EngineState[EngineState["ERROR"] = 6] = "ERROR";
    EngineState[EngineState["EXITING"] = 7] = "EXITING";
    EngineState[EngineState["EXITED"] = 8] = "EXITED";
})(EngineState = exports.EngineState || (exports.EngineState = {}));
const incidentalEngineStates = [
    EngineState.ERROR,
    EngineState.EXITING,
    EngineState.EXITED,
];
const availableEngineStateTransitions = {
    [EngineState.NOT_STARTED]: [
        EngineState.CHECK_USI,
        ...incidentalEngineStates,
    ],
    [EngineState.CHECK_USI]: [
        EngineState.SET_OPTIONS,
        ...incidentalEngineStates,
    ],
    [EngineState.SET_OPTIONS]: [
        EngineState.IS_READY,
        ...incidentalEngineStates,
    ],
    [EngineState.IS_READY]: [
        EngineState.IS_GOING,
        EngineState.GAME_OVER,
        ...incidentalEngineStates,
    ],
    [EngineState.IS_GOING]: [
        EngineState.IS_READY,
        ...incidentalEngineStates,
    ],
    [EngineState.GAME_OVER]: [
        EngineState.IS_READY,
        ...incidentalEngineStates,
    ],
    [EngineState.ERROR]: [
        ...incidentalEngineStates,
    ],
    [EngineState.EXITING]: [
        ...incidentalEngineStates,
    ],
    [EngineState.EXITED]: [],
};
//---
class EngineInfo {
    constructor() {
        this.name = "";
        this.author = "";
        this.options = {};
    }
}
exports.EngineInfo = EngineInfo;
//---
class EngineConfigurator {
    constructor(availableOptions) {
        this.availableOptions = availableOptions;
    }
    setString(name, value) {
        // TODO
    }
    setNumber(name, value) {
        // TODO
    }
    setBoolean(name, value) {
        // TODO
    }
}
exports.EngineConfigurator = EngineConfigurator;
exports.DEFAULT_GO_OPTIONS = {
    ponder: false,
    btime: 0,
    wtime: 0,
    byoyomi: 0,
    winc: 0,
    binc: 0,
    infinite: false,
};
/**
 * Base class of engines.
 *
 * Child classes can't emit event directly but events will be emitted via
 * some protected methods (e.g. debug, error).
 */
class Engine {
    constructor() {
        this.state = EngineState.NOT_STARTED;
        this.info = new EngineInfo();
        this.eventEmitter = new eventemitter3_1.default();
    }
    //----------------------------------------------------------------------------
    // User Methods
    //----------------------------------------------------------------------------
    start() {
        this.assertState(EngineState.CHECK_USI);
        this._writeln("usi");
    }
    newGame() {
        this.assertState(EngineState.SET_OPTIONS, EngineState.GAME_OVER);
        this._writeln("isready");
    }
    /**
     * @param state SFEN or startpos
     * @param moves string of moves joined with one space.
     */
    setGameState(state = "startpos", moves = "") {
        this.assertState(EngineState.IS_READY);
        this._writeln(`position ${state} moves ${moves}`);
    }
    go(opts = exports.DEFAULT_GO_OPTIONS) {
        this.assertState(EngineState.IS_READY);
        const cmd = ["go"];
        if (opts.ponder) {
            cmd.push("ponder");
        }
        if (opts.btime > 0) {
            cmd.push(`btime ${opts.btime}`);
        }
        if (opts.wtime > 0) {
            cmd.push(`wtime ${opts.wtime}`);
        }
        if (opts.byoyomi > 0) {
            cmd.push(`byoyomi ${opts.byoyomi}`);
        }
        if (opts.binc > 0) {
            cmd.push(`binc ${opts.binc}`);
        }
        if (opts.winc > 0) {
            cmd.push(`winc ${opts.winc}`);
        }
        if (opts.infinite) {
            cmd.push("infinite");
        }
        this._writeln(cmd.join(" "));
        this.changeState(EngineState.IS_GOING);
    }
    stop() {
        if (this.state === EngineState.IS_READY) {
            return;
        }
        this.assertState(EngineState.IS_GOING);
        this._writeln("stop");
    }
    quit(force = false) {
        this._writeln("quit");
        this.changeState(EngineState.EXITING);
        if (force) {
            this.exit();
        }
    }
    gameOver(type) {
        this.assertState(EngineState.IS_READY);
        this._writeln(`gameover ${type}`);
        this.changeState(EngineState.GAME_OVER);
    }
    on(name, cb) {
        this.eventEmitter.on(name, cb);
    }
    off(name, cb) {
        this.eventEmitter.off(name, cb);
    }
    //----------------------------------------------------------------------------
    emitDebug(msg, ...args) {
        this.eventEmitter.emit("debug", msg, ...args);
    }
    emitError(err) {
        this.eventEmitter.emit("error", err);
    }
    emitExit() {
        this.eventEmitter.emit("exit");
    }
    emitConfigure(c) {
        this.eventEmitter.emit("configure", c);
    }
    emitReady() {
        this.eventEmitter.emit("ready");
    }
    emitInfo(info) {
        this.eventEmitter.emit("info", info);
    }
    emitBestMove(move) {
        this.eventEmitter.emit("bestmove", move);
    }
    changeState(state) {
        if (state === this.state) {
            return;
        }
        if (availableEngineStateTransitions[this.state].indexOf(state) === -1) {
            this.error(new Error(`invalid state transition: ${EngineState[this.state]} -> ${EngineState[state]}`));
            return;
        }
        this.emitDebug(`change state: ${EngineState[this.state]} -> ${EngineState[state]}`);
        this.state = state;
    }
    assertState(...states) {
        if (states.indexOf(this.state) === -1) {
            const statesStr = states.map(s => EngineState[s]).join("/");
            this.error(new Error(`invalid state: expected ${statesStr}, but ${EngineState[this.state]}`));
        }
    }
    //---
    debug(msg, ...args) {
        this.emitDebug(msg, ...args);
    }
    error(err) {
        if (this.state !== EngineState.EXITED) {
            this.changeState(EngineState.ERROR);
        }
        this.emitError(err);
        if (this.state !== EngineState.EXITED) {
            this.exit();
        }
    }
    /**
     * This method should be called when child process is ready.
     */
    processStarted() {
        this.changeState(EngineState.CHECK_USI);
    }
    beforeExit() {
        this.changeState(EngineState.EXITING);
    }
    afterExit() {
        this.changeState(EngineState.EXITED);
        this.emitExit();
    }
    parseLine(line) {
        this.emitDebug(`< ${line}`);
        line = line.trim();
        if (line.length === 0) {
            return;
        }
        const args = line.split(" ");
        switch (this.state) {
            case EngineState.CHECK_USI: {
                switch (args[0]) {
                    case "id": {
                        const value = args.slice(2).join(" ");
                        if (args[1] === "name") {
                            this.info.name = value;
                        }
                        else if (args[1] === "author") {
                            this.info.author = value;
                        }
                        return;
                    }
                    case "option": {
                        // NOTE: These are not good implementation.
                        const type = args[4];
                        const def = args[6];
                        const val = { type };
                        if (type === "string") {
                            val.default = def;
                        }
                        else if (type === "spin") {
                            val.default = parseInt(def, 10);
                            val.min = parseInt(args[8], 10);
                            val.max = parseInt(args[10], 10);
                        }
                        else if (val.type === "check") {
                            val.default = args[6] === "true";
                        }
                        this.info.options[args[2]] = val;
                        return;
                    }
                    case "usiok": {
                        this.changeState(EngineState.SET_OPTIONS);
                        const c = new EngineConfigurator(this.info.options);
                        this.emitConfigure(c);
                        return;
                    }
                }
                break;
            }
            case EngineState.SET_OPTIONS: {
                switch (args[0]) {
                    case "info": {
                        if (args[1] === "string") {
                            this.emitInfo({ string: args.slice(2).join(" ") });
                        }
                        else {
                            // ignored
                        }
                        return;
                    }
                    case "readyok": {
                        this.changeState(EngineState.IS_READY);
                        this._writeln("usinewgame");
                        this.emitReady();
                        return;
                    }
                }
                break;
            }
            case EngineState.IS_GOING: {
                switch (args[0]) {
                    case "info": {
                        const info = this.parseInfoArgs(args.slice(1));
                        this.emitInfo(info);
                        return;
                    }
                    case "bestmove": {
                        // NOTE: changeState() should be called before emiting because
                        // the state can be changed in event handlers.
                        this.changeState(EngineState.IS_READY);
                        this.emitBestMove(args[1]);
                        // TODO: ponder
                        return;
                    }
                }
                break;
            }
            case EngineState.GAME_OVER: {
                switch (args[0]) {
                    case "readyok": {
                        this.changeState(EngineState.IS_READY);
                        this._writeln("usinewgame");
                        this.emitReady();
                        return;
                    }
                }
                break;
            }
            default: {
                this.error(new Error("no line is expected"));
                return;
            }
        }
        this.error(new Error(`unexpected line: ${line}`));
    }
    parseInfoArgs(args) {
        const info = {};
        let i = 0;
        while (i < args.length) {
            if (i + 1 >= args.length) {
                // engine error
                break;
            }
            const key = args[i];
            if (key === "score") {
                i++;
                continue;
            }
            const value = args[i + 1];
            switch (key) {
                case "depth":
                case "seldepth":
                case "time":
                case "nodes":
                case "multipv":
                case "currmove":
                case "hashfull":
                case "nps": {
                    info[key] = parseInt(value, 10);
                    i += 2;
                    break;
                }
                case "pv": {
                    info[key] = args.slice(i + 1);
                    i = args.length;
                    break;
                }
                case "cp": {
                    info[key] = {
                        value: parseInt(value, 10),
                    };
                    i += 2;
                    if (i < args.length) {
                        if (args[i] === "lowerbound") {
                            info[key].bound = "lower";
                            i++;
                        }
                        else if (args[i] === "upperbound") {
                            info[key].bound = "upper";
                            i++;
                        }
                    }
                    break;
                }
                case "mate": {
                    info[key] = {
                        num: parseInt(value.slice(1), 10) || undefined,
                        is_engine_side_mated: value[0] === "-",
                    };
                    break;
                }
                case "string": {
                    info.string = args.slice(i + 1).join(" ");
                    i = args.length;
                    break;
                }
            }
        }
        return info;
    }
    _writeln(line) {
        this.emitDebug(`> ${line}`);
        this.writeln(line);
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map