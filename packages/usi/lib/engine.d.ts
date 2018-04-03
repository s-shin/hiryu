export declare type Move = string;
export declare type BestMove = Move | "resign" | "win";
export declare enum EngineState {
    NOT_STARTED = 0,
    CHECK_USI = 1,
    SET_OPTIONS = 2,
    IS_READY = 3,
    IS_GOING = 4,
    GAME_OVER = 5,
    ERROR = 6,
    EXITING = 7,
    EXITED = 8,
}
export interface EngineOptionString {
    type: "string";
    default: string;
}
export interface EngineOptionBoolean {
    type: "check";
    default: boolean;
}
export interface EngineOptionNumber {
    type: "spin";
    min: number;
    max: number;
    default: number;
}
export declare type EngineOptionValue = EngineOptionString | EngineOptionBoolean | EngineOptionNumber;
export interface EngineOptions {
    [name: string]: EngineOptionValue;
}
export declare class EngineInfo {
    name: string;
    author: string;
    options: EngineOptions;
}
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
export declare class EngineConfigurator {
    readonly availableOptions: EngineOptions;
    constructor(availableOptions: EngineOptions);
    setString(name: string, value: string): void;
    setNumber(name: string, value: number): void;
    setBoolean(name: string, value: boolean): void;
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
/**
 * Base class of engines.
 *
 * Child classes can't emit event directly but events will be emitted via
 * some protected methods (e.g. debug, error).
 */
export declare abstract class Engine {
    state: EngineState;
    info: EngineInfo;
    private eventEmitter;
    start(): void;
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
    on(name: "configure", cb: (c: EngineConfigurator) => void): void;
    on(name: "ready" | "exit", cb: () => void): void;
    on(name: "info", cb: (info: Info) => void): void;
    on(name: "bestmove", cb: (move: BestMove) => void): void;
    on(name: "error", cb: (err: Error) => void): void;
    off(name: "debug", cb: (msg: string, ...args: any[]) => void): void;
    off(name: "configure", cb: (c: EngineConfigurator) => void): void;
    off(name: "ready" | "exit", cb: () => void): void;
    off(name: "info", cb: (info: Info) => void): void;
    off(name: "bestmove", cb: (move: BestMove) => void): void;
    off(name: "error", cb: (err: Error) => void): void;
    /**
     * @param line Single line string without linebreak.
     */
    protected abstract writeln(line: string): void;
    /**
     * In this method, beforeExit() and afterExit() should be called properly.
     * afterExit() can be called asynchronously.
     */
    protected abstract exit(): void;
    private emitDebug(msg, ...args);
    private emitError(err);
    private emitExit();
    private emitConfigure(c);
    private emitReady();
    private emitInfo(info);
    private emitBestMove(move);
    private changeState(state);
    private assertState(...states);
    protected debug(msg: string, ...args: any[]): void;
    protected error(err: Error): void;
    /**
     * This method should be called when child process is ready.
     */
    protected processStarted(): void;
    protected beforeExit(): void;
    protected afterExit(): void;
    protected parseLine(line: string): void;
    private parseInfoArgs(args);
    private _writeln(line);
}
