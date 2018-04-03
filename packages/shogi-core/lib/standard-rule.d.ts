import * as Immutable from "immutable";
import * as core from "./core";
export declare const DROPPABLE_PIECE_IDS: Immutable.List<core.PieceId>;
export declare enum Violation {
    UNACCEPTABLE_EVENT_FOR_STATE = 0,
    INVALID_TURN = 1,
    NOT_DROPPABLE_PIECE = 2,
    NOT_DROPPABLE_POSITION = 3,
    NOT_MOVABLE_POSITION = 4,
    NO_SPECIFIED_PIECE_IN_HAND = 5,
    NOT_MOVABLE_PIECE = 6,
    CANNOT_PUT_PIECE_ONTO_BOARD = 7,
    NO_SPECIFIED_PIECE_ON_BOARD = 8,
    NIFU = 9,
    UCHIFUZUME = 10,
}
export declare enum GameStatus {
    NOT_STARTED = 0,
    STARTED = 1,
    END = 2,
}
declare const Context_base: Immutable.Record.Factory<{
    status: GameStatus;
    stateHistory: number[];
    lastViolation: Violation | null;
}>;
export declare class Context extends Context_base {
}
declare const Game_base: Immutable.Record.Factory<{
    state: core.State;
    ctx: Context;
}>;
export declare class Game extends Game_base implements core.CommonGameProps {
    static preset(h: core.Handicap): Game;
}
export declare function isNeverMovable(pos: core.Position, color: core.Color, piece: core.Piece): boolean;
export declare function isInPromortableArea(pos: core.Position, color: core.Color): boolean;
declare const MoveCandidate_base: Immutable.Record.Factory<{
    to: core.Position;
    piece: core.Piece;
    isDrop: boolean;
}>;
export declare class MoveCandidate extends MoveCandidate_base {
}
export declare function getMoveCandidates(board: core.Board, pos: core.Position): Immutable.Set<MoveCandidate>;
export declare function getDropCandidates(board: core.Board, color: core.Color, piece: core.Piece): Immutable.Set<MoveCandidate>;
export declare const reducer: core.GameReducer<Game>;
declare const MoveEventBundle_base: Immutable.Record.Factory<{
    csa: core.CSAMoveEvent;
    usi: core.USIMoveEvent;
    japaneseNotation: core.JapaneseNotationMoveEvent;
}>;
export declare class MoveEventBundle extends MoveEventBundle_base implements core.AllStringifiable {
    toUSIString(): string;
    toCSAString(): string;
    toJapaneseNotationString(): string;
}
export declare function convertCSAMoveEventToUSIMoveEvent(csa: core.CSAMoveEvent, state: core.State): Error | core.USIMoveEvent;
export declare function convertCSAMoveEventToJapaneseNotationMoveEvent(csa: core.CSAMoveEvent, state: core.State, prevDst?: core.Position): Error | core.JapaneseNotationMoveEvent;
export declare function getMoveEventBundle(state: core.State, moveEvent: core.MoveEvent, prevDst?: core.Position): Error | MoveEventBundle;
declare const EventResult_base: Immutable.Record.Factory<{
    game: Game;
    by: core.StartEvent | core.ResignEvent | MoveEventBundle | undefined;
}>;
export declare class EventResult extends EventResult_base {
    applyEvent(event: core.Event, prevDst?: core.Position): EventResult;
}
export declare class GameManager {
    private _record;
    private _currentForkIndex;
    private _currentEventPointer;
    private _eventResults;
    constructor(arg?: GameManager | core.Record);
    readonly currentForkIndex: number;
    readonly currentEventIndex: number;
    readonly currentEventPointer: core.RecordEventPointer;
    readonly currentEventResult: EventResult;
    readonly currentGame: Game;
    sync(forkIndex: number): void;
    /**
     * @return position <0> moves <1>
     * @see http://www.geocities.jp/shogidokoro/usi.html
     */
    toUSIPositionAndMoves(): [string, string];
    setEventPointer(ptr: core.RecordEventPointer): boolean;
    getEventResults(forkIndex?: number): EventResult[];
    getEventResultEntries(forkIndex?: number): [core.RecordEventPointer, EventResult][];
    getEventPointers(forkIndex?: number): core.RecordEventPointer[];
    goto(n: number, isOffset?: boolean): boolean;
    next(n?: number): boolean;
    prev(n?: number): boolean;
    first(): boolean;
    last(): boolean;
    start(time?: core.Time): boolean;
    move(from: core.PositionLike, to: core.PositionLike, piece: core.Piece, time?: core.Time): boolean;
    drop(to: core.PositionLike, piece: core.Piece, time?: core.Time): boolean;
    resign(time?: core.Time): boolean;
    private addEvent(event);
}
