export declare enum EngineState {
    NOT_STARTED = 0,
    CHECK_USI = 1,
    SET_OPTIONS = 2,
    IS_READY = 3,
    IS_GOING = 4,
    GAME_OVER = 5,
    ERROR = 6,
    EXITING = 7,
    EXITED = 8
}
export declare type EngineOptionTypeToken = "string" | "check" | "spin" | "combo" | "button" | "filename";
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
export declare type EngineOptionDefinition = EngineOptionString | EngineOptionCheck | EngineOptionSpin | EngineOptionCombo | EngineOptionButton | EngineOptionFilename;
export interface EngineOptions {
    [name: string]: EngineOptionDefinition;
}
export declare class EngineInfo {
    name: string;
    author: string;
    options: EngineOptions;
}
export declare type Move = string;
export declare type BestMove = Move | "resign" | "win";
export declare enum ScoreType {
    CP = 0,
    MATE = 1
}
export interface CpScore {
    type: ScoreType.CP;
    value: number;
    bound?: "lower" | "upper";
}
export interface MateScore {
    type: ScoreType.MATE;
    value: number | "+" | "-";
}
export declare type Score = CpScore | MateScore;
export interface Info {
    depth?: number;
    seldepth?: number;
    time?: number;
    nodes?: number;
    pv?: Move[];
    multipv?: number;
    score?: Score;
    currmove?: Move;
    hashfull?: number;
    nps?: number;
    string?: string;
}
export declare abstract class EngineAdapter {
    private engine?;
    bindEngine(engine: Engine): void;
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
    debug(msg: string, ...args: any[]): void;
    onReady(): void;
    onError(err: Error): void;
    onReadLine(line: string): void;
    onBeforeExit(): void;
    onAfterExit(): void;
}
export interface GoOptions {
    /**
     * \~japanese
     * 先読みモードにするか
     * NOTE: 不適切な仕様という意見も多いので、使用不可にするか
     */
    ponder: boolean;
    btime: number;
    wtime: number;
    byoyomi: number;
    binc: number;
    winc: number;
    infinite: boolean;
}
export declare const DEFAULT_GO_OPTIONS: GoOptions;
export declare type EngineEvents = "debug" | "configure" | "ready" | "exit" | "info" | "bestmove" | "error";
export declare class Engine {
    private adapter;
    state: EngineState;
    info: EngineInfo;
    private eventEmitter;
    constructor(adapter: EngineAdapter);
    start(): void;
    setOption(name: string, value: string): void;
    newGame(): void;
    /**
     * @param state SFEN or startpos
     * @param moves string of moves joined with one space.
     */
    setGameState(state?: string, moves?: string): void;
    go(opts?: GoOptions): void;
    stop(): void;
    quit(force?: boolean): void;
    gameOver(type: "win" | "lose" | "draw"): void;
    on(name: "debug", cb: (msg: string, ...args: any[]) => void): void;
    on(name: "configure", cb: (availableOptions: EngineOptions) => void): void;
    on(name: "ready" | "exit", cb: () => void): void;
    on(name: "info", cb: (info: Info) => void): void;
    on(name: "bestmove", cb: (move: BestMove) => void): void;
    on(name: "error", cb: (err: Error) => void): void;
    removeListener(name: "debug", cb: (msg: string, ...args: any[]) => void): void;
    removeListener(name: "configure", cb: (availableOptions: EngineOptions) => void): void;
    removeListener(name: "ready" | "exit", cb: () => void): void;
    removeListener(name: "info", cb: (info: Info) => void): void;
    removeListener(name: "bestmove", cb: (move: BestMove) => void): void;
    removeListener(name: "error", cb: (err: Error) => void): void;
    off(name: "debug", cb: (msg: string, ...args: any[]) => void): void;
    off(name: "configure", cb: (availableOptions: EngineOptions) => void): void;
    off(name: "ready" | "exit", cb: () => void): void;
    off(name: "info", cb: (info: Info) => void): void;
    off(name: "bestmove", cb: (move: BestMove) => void): void;
    off(name: "error", cb: (err: Error) => void): void;
    _debug(msg: string, ...args: any[]): void;
    _error(err: Error): void;
    /**
     * This method should be called when child process is ready.
     */
    _onReady(): void;
    _onBeforeExit(): void;
    _onAfterExit(): void;
    _onReadLine(line: string): void;
    private parseInfoArgs;
    private emitDebug;
    private emitError;
    private emitExit;
    private emitConfigure;
    private emitReady;
    private emitInfo;
    private emitBestMove;
    private changeState;
    private assertState;
    private writeln;
}
