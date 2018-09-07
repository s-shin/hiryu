import EventEmitter from "eventemitter3";

export enum EngineState {
  NOT_STARTED,
  CHECK_USI,
  SET_OPTIONS,
  IS_READY,
  IS_GOING,
  GAME_OVER,
  ERROR,
  EXITING,
  EXITED,
}

interface EngineStateTransitions {
  // NOTE: enum support not yet...
  // [state in EngineState]: EngineState[];
  [state: number]: EngineState[];
}

const incidentalEngineStates = [EngineState.ERROR, EngineState.EXITING, EngineState.EXITED];

const availableEngineStateTransitions: EngineStateTransitions = {
  [EngineState.NOT_STARTED]: [EngineState.CHECK_USI, ...incidentalEngineStates],
  [EngineState.CHECK_USI]: [EngineState.SET_OPTIONS, ...incidentalEngineStates],
  [EngineState.SET_OPTIONS]: [EngineState.IS_READY, ...incidentalEngineStates],
  [EngineState.IS_READY]: [EngineState.IS_GOING, EngineState.GAME_OVER, ...incidentalEngineStates],
  [EngineState.IS_GOING]: [EngineState.IS_READY, ...incidentalEngineStates],
  [EngineState.GAME_OVER]: [EngineState.IS_READY, ...incidentalEngineStates],
  [EngineState.ERROR]: [...incidentalEngineStates],
  [EngineState.EXITING]: [...incidentalEngineStates],
  [EngineState.EXITED]: [],
};

//---

export type EngineOptionTypeToken = "string" | "check" | "spin" | "combo" | "button" | "filename";

export interface EngineOptionBase {
  name: string;
  type: EngineOptionTypeToken;
}

export interface EngineOptionString extends EngineOptionBase {
  type: "string";
  default: string;
}

export interface EngineOptionCheck extends EngineOptionBase {
  type: "check";
  default: boolean;
}

export interface EngineOptionSpin extends EngineOptionBase {
  type: "spin";
  min: number;
  max: number;
  default: number;
}

export interface EngineOptionCombo extends EngineOptionBase {
  type: "combo";
  vars: string[];
  default: string;
}

export interface EngineOptionButton extends EngineOptionBase {
  type: "button";
}

export interface EngineOptionFilename extends EngineOptionBase {
  type: "filename";
  default: string;
}

export type EngineOptionDefinition =
  | EngineOptionString
  | EngineOptionCheck
  | EngineOptionSpin
  | EngineOptionCombo
  | EngineOptionButton
  | EngineOptionFilename;

export interface EngineOptions {
  [name: string]: EngineOptionDefinition;
}

//---

export class EngineInfo {
  name = "";
  author = "";
  options: EngineOptions = {};
}

//---

export type Move = string;

export type BestMove = Move | "resign" | "win";

export interface ScoreInfo {
  value: number;
  bound?: "lower" | "upper";
}

export interface MateInfo {
  num?: number;
  is_engine_side_mated: boolean;
}

export interface Info {
  depth?: number;
  seldepth?: number;
  time?: number;
  nodes?: number;
  pv?: Move[];
  multipv?: number;
  cp?: ScoreInfo;
  mate?: MateInfo;
  currmove?: Move;
  hashfull?: number;
  nps?: number;
  string?: string;
}

//---

export abstract class EngineAdapter {
  private engine?: Engine;

  bindEngine(engine: Engine) {
    this.engine = engine;
  }

  /**
   * Run engine process.
   * When it's ready, call `onReady()`.
   */
  abstract start(): void;

  /**
   * Output line to engine process.
   *
   * @param line Single line string WITHOUT linebreak.
   */
  abstract writeln(line: string): void;

  /**
   * In this method, `onBeforeExit()` and `onAfterExit()` should be called properly.
   * `onAfterExit()` can be called asynchronously.
   */
  abstract exit(): void;

  debug(msg: string, ...args: any[]) {
    this.engine!._debug(msg, ...args);
  }

  onReady() {
    this.engine!._onReady();
  }

  onError(err: Error) {
    this.engine!._error(err);
  }

  onReadLine(line: string) {
    this.engine!._onReadLine(line);
  }

  onBeforeExit() {
    this.engine!._onBeforeExit();
  }

  onAfterExit() {
    this.engine!._onAfterExit();
  }
}

//---

export interface GoOptions {
  /**
   * \~japanese
   * 先読みモードにするか
   * NOTE: 不適切な仕様という意見も多いので、使用不可にするか
   */
  ponder: boolean;
  //! \~japanese 下手持ち時間 [ms]
  btime: number;
  //! \~japanese 上手持ち時間 [ms]
  wtime: number;
  //! \~japanese 秒読み時間 [ms]
  byoyomi: number;
  //! \~japanese 下手の指し手ごとの増加時間 [ms/手]
  binc: number;
  //! \~japanese 上手の指し手ごとの増加時間 [ms/手]
  winc: number;
  //! \~japanese 思考時間無制限
  infinite: boolean;
}

export const DEFAULT_GO_OPTIONS: GoOptions = {
  ponder: false,
  btime: 0,
  wtime: 0,
  byoyomi: 0,
  winc: 0,
  binc: 0,
  infinite: false,
};

export type EngineEvents = "debug" | "configure" | "ready" | "exit" | "info" | "bestmove" | "error";

export class Engine {
  state = EngineState.NOT_STARTED;
  info = new EngineInfo();
  private eventEmitter = new EventEmitter();

  constructor(private adapter: EngineAdapter) {
    adapter.bindEngine(this);
  }

  //----------------------------------------------------------------------------
  // User Methods
  //----------------------------------------------------------------------------

  start() {
    this.adapter.start();
  }

  setOption(name: string, value: string) {
    this.assertState(EngineState.SET_OPTIONS);
    this.writeln(`setoption name ${name} value ${value}`);
  }

  newGame() {
    this.assertState(EngineState.SET_OPTIONS, EngineState.GAME_OVER);
    this.writeln("isready");
  }

  /**
   * @param state SFEN or startpos
   * @param moves string of moves joined with one space.
   */
  setGameState(state = "startpos", moves = "") {
    this.assertState(EngineState.IS_READY);
    this.writeln(`position ${state} moves ${moves}`);
  }

  go(opts: GoOptions = DEFAULT_GO_OPTIONS) {
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
    this.writeln(cmd.join(" "));
    this.changeState(EngineState.IS_GOING);
  }

  stop() {
    if (this.state === EngineState.IS_READY) {
      return;
    }
    this.assertState(EngineState.IS_GOING);
    this.writeln("stop");
  }

  quit(force = false) {
    this.writeln("quit");
    this.changeState(EngineState.EXITING);
    if (force) {
      this.adapter.exit();
    }
  }

  gameOver(type: "win" | "lose" | "draw") {
    this.assertState(EngineState.IS_READY);
    this.writeln(`gameover ${type}`);
    this.changeState(EngineState.GAME_OVER);
  }

  on(name: "debug", cb: (msg: string, ...args: any[]) => void): void;
  on(name: "configure", cb: (availableOptions: EngineOptions) => void): void;
  on(name: "ready" | "exit", cb: () => void): void;
  on(name: "info", cb: (info: Info) => void): void;
  on(name: "bestmove", cb: (move: BestMove) => void): void;
  on(name: "error", cb: (err: Error) => void): void;
  on(name: string, cb: (...args: any[]) => void) {
    this.eventEmitter.on(name, cb);
  }

  removeListener(name: "debug", cb: (msg: string, ...args: any[]) => void): void;
  removeListener(name: "configure", cb: (availableOptions: EngineOptions) => void): void;
  removeListener(name: "ready" | "exit", cb: () => void): void;
  removeListener(name: "info", cb: (info: Info) => void): void;
  removeListener(name: "bestmove", cb: (move: BestMove) => void): void;
  removeListener(name: "error", cb: (err: Error) => void): void;
  removeListener(name: string, cb: (...args: any[]) => void) {
    this.eventEmitter.removeListener(name, cb);
  }

  off(name: "debug", cb: (msg: string, ...args: any[]) => void): void;
  off(name: "configure", cb: (availableOptions: EngineOptions) => void): void;
  off(name: "ready" | "exit", cb: () => void): void;
  off(name: "info", cb: (info: Info) => void): void;
  off(name: "bestmove", cb: (move: BestMove) => void): void;
  off(name: "error", cb: (err: Error) => void): void;
  off(name: string, cb: (...args: any[]) => void) {
    this.eventEmitter.off(name, cb);
  }

  //----------------------------------------------------------------------------
  // Methods for EngineAdapter
  //----------------------------------------------------------------------------

  _debug(msg: string, ...args: any[]) {
    this.emitDebug(msg, ...args);
  }

  _error(err: Error) {
    if (this.state !== EngineState.EXITED) {
      this.changeState(EngineState.ERROR);
    }
    this.emitError(err);
    if (this.state !== EngineState.EXITED) {
      this.adapter.exit();
    }
  }

  /**
   * This method should be called when child process is ready.
   */
  _onReady() {
    this.changeState(EngineState.CHECK_USI);
    this.writeln("usi");
  }

  _onBeforeExit() {
    this.changeState(EngineState.EXITING);
  }

  _onAfterExit() {
    this.changeState(EngineState.EXITED);
    this.emitExit();
  }

  _onReadLine(line: string) {
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
            } else if (args[1] === "author") {
              this.info.author = value;
            }
            return;
          }
          case "option": {
            if (args.length < 5 || args[1] !== "name" || args[3] !== "type") {
              return this._error(new Error("bad option command"));
            }
            const name = args[2];
            const type = args[4];
            const definition: any = { name, type };

            const longStringValue = (...v: string[]) => [v.join(" "), v.length];
            const stringValue = (v: string) => [v, 1];
            const numberValue = (v: string) => [parseInt(v, 10), 1];
            const booleanValue = (v: string) => [v === "true", 1];
            const stringArrayValue = (v: string) => [[stringValue(v)], 1];
            const paramParsers: any = {
              string: {
                default: longStringValue,
              },
              spin: {
                default: numberValue,
                min: numberValue,
                max: numberValue,
              },
              check: {
                default: booleanValue,
              },
              combo: {
                default: stringValue,
                var: stringArrayValue,
              },
              button: {},
              filename: {
                default: longStringValue,
              },
            };

            let params = args.slice(5);
            const parseParam = paramParsers[type];
            while (params.length > 0) {
              if (params.length < 2) {
                return this._error(new Error(`bad option command line: ${line}`));
              }
              const [key, ...values] = params;
              if (!parseParam[key]) {
                return this._error(new Error(`bad option parameter: ${key}`));
              }
              const [v, consumed] = parseParam[key](...values);
              if (Array.isArray(v)) {
                definition[key] = [...(definition[key] || []), ...v];
              } else {
                definition[key] = v;
              }
              params = params.slice(1 + consumed);
            }
            for (const key in parseParam) {
              if (!(key in definition)) {
                return this._error(new Error(`config parameter '${key}' was not found`));
              }
            }
            this.info.options[name] = definition;
            return;
          }
          case "usiok": {
            this.changeState(EngineState.SET_OPTIONS);
            this.emitConfigure(this.info.options);
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
            } else {
              // ignored
            }
            return;
          }
          case "readyok": {
            this.changeState(EngineState.IS_READY);
            this.writeln("usinewgame");
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
            this.writeln("usinewgame");
            this.emitReady();
            return;
          }
        }
        break;
      }
      case EngineState.EXITING:
      case EngineState.EXITED: {
        return this.emitDebug("given line is discarded");
      }
      default: {
        return this._error(new Error("no line is expected"));
      }
    }
    this._error(new Error(`unexpected line: ${line}`));
  }

  private parseInfoArgs(args: string[]) {
    const info: any = {};
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
            } else if (args[i] === "upperbound") {
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
    return info as Info;
  }

  //---

  private emitDebug(msg: string, ...args: any[]) {
    this.eventEmitter.emit("debug", msg, ...args);
  }
  private emitError(err: Error) {
    this.eventEmitter.emit("error", err);
  }
  private emitExit() {
    this.eventEmitter.emit("exit");
  }
  private emitConfigure(availableOptions: EngineOptions) {
    this.eventEmitter.emit("configure", availableOptions);
  }
  private emitReady() {
    this.eventEmitter.emit("ready");
  }
  private emitInfo(info: Info) {
    this.eventEmitter.emit("info", info);
  }
  private emitBestMove(move: BestMove) {
    this.eventEmitter.emit("bestmove", move);
  }

  private changeState(state: EngineState) {
    if (state === this.state) {
      return;
    }
    if (availableEngineStateTransitions[this.state].indexOf(state) === -1) {
      this._error(new Error(`invalid state transition: ${EngineState[this.state]} -> ${EngineState[state]}`));
      return;
    }
    this.emitDebug(`change state: ${EngineState[this.state]} -> ${EngineState[state]}`);
    this.state = state;
  }

  private assertState(...states: EngineState[]) {
    if (states.indexOf(this.state) === -1) {
      const statesStr = states.map(s => EngineState[s]).join("/");
      this._error(new Error(`invalid state: expected ${statesStr}, but ${EngineState[this.state]}`));
    }
  }

  private writeln(line: string) {
    this.emitDebug(`> ${line}`);
    this.adapter.writeln(line);
  }
}
