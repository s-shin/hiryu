/// <reference types="luxon" />
import * as Immutable from "immutable";
import { DateTime, Duration, Interval } from "luxon";
export interface USIStringifyable {
    toUSIString(): string;
}
export interface CSAStringifyable {
    toCSAString(): string;
}
export interface JapaneseNotationStringifyable {
    toJapaneseNotationString(): string;
}
export interface AllStringifiable extends USIStringifyable, CSAStringifyable, JapaneseNotationStringifyable {
}
export declare enum PieceId {
    FU = 0,
    KY = 1,
    KE = 2,
    GI = 3,
    KI = 4,
    HI = 5,
    KA = 6,
    OU = 7,
    TO = 8,
    NY = 9,
    NK = 10,
    NG = 11,
    RY = 12,
    UM = 13,
}
export declare const HEADS_PIECE_IDS: Immutable.List<PieceId>;
export declare const TAILS_PIECE_IDS: Immutable.List<PieceId>;
export declare const PIECE_ID_TO_CSA_STRING: Immutable.Map<PieceId, string>;
export declare const PIECE_ID_TO_USI_STRING: Immutable.Map<PieceId, string>;
export declare const PIECE_ID_TO_JAPANESE_NOTATION_STRING: Immutable.Map<PieceId, string>;
export declare const CSA_STRING_TO_PIECE_ID: Immutable.Map<string, PieceId>;
export declare const USI_STRING_TO_PIECE_ID: Immutable.Map<string, PieceId>;
export declare const JAPANESE_NOTATION_STRING_TO_PIECE_ID: Immutable.Map<string, PieceId>;
export declare const PROMOTE_MAP: Immutable.Map<PieceId, PieceId>;
export declare const DEMOTE_MAP: Immutable.Map<PieceId, PieceId>;
export declare class Piece implements Immutable.ValueObject, AllStringifiable {
    readonly id: PieceId;
    static readonly FU: Piece;
    static readonly KY: Piece;
    static readonly KE: Piece;
    static readonly GI: Piece;
    static readonly KI: Piece;
    static readonly HI: Piece;
    static readonly KA: Piece;
    static readonly OU: Piece;
    static readonly TO: Piece;
    static readonly NY: Piece;
    static readonly NK: Piece;
    static readonly NG: Piece;
    static readonly RY: Piece;
    static readonly UM: Piece;
    constructor(id: PieceId);
    isFU(): boolean;
    isKY(): boolean;
    isKE(): boolean;
    isGI(): boolean;
    isKI(): boolean;
    isHI(): boolean;
    isKA(): boolean;
    isOU(): boolean;
    isTO(): boolean;
    isNY(): boolean;
    isNK(): boolean;
    isNG(): boolean;
    isRY(): boolean;
    isUM(): boolean;
    canPromote(): boolean;
    isHeads(): boolean;
    isTails(): boolean;
    flip(alt?: null): Piece | null;
    heads(): Piece;
    tails(alt?: null): Piece | null;
    toCSAString(): string;
    static fromCSAString(s: string): Piece | null;
    toUSIString(): string;
    static fromUSIString(s: string): Piece | null;
    toJapaneseNotationString(): string;
    toString(): string;
    equals(other: any): boolean;
    hashCode(): PieceId;
}
export declare enum ColorId {
    BLACK = 0,
    WHITE = 1,
}
export declare class Color implements Immutable.ValueObject, AllStringifiable {
    id: ColorId;
    static readonly BLACK: Color;
    static readonly WHITE: Color;
    private constructor();
    isBlack(): boolean;
    isWhite(): boolean;
    flip(): Color;
    toCSAString(): "+" | "-";
    toUSIString(): "b" | "w";
    toJapaneseNotationString(marks?: string[]): string;
    toString(): string;
    equals(other: any): boolean;
    hashCode(): ColorId;
}
export declare type PositionLike = Position | {
    x: number;
    y: number;
} | [number, number];
declare const Position_base: Immutable.Record.Factory<{
    x: number;
    y: number;
}>;
export declare class Position extends Position_base implements AllStringifiable {
    static readonly MIN_INDEX: number;
    static readonly MAX_INDEX: number;
    static readonly INDICES: Immutable.List<number>;
    static readonly REV_INDICES: Immutable.List<number>;
    static from(pos: PositionLike): Position;
    static from(x: number, y: number): Position;
    move(dx?: number, dy?: number): Position;
    isInsideBoard(): boolean;
    toCSAString(): string;
    toUSIString(): string;
    toJapaneseNotationString(): string;
    flip(): Position;
    toString(): string;
}
export declare enum Handicap {
    NONE = 0,
    KY = 1,
    HI = 2,
    KA = 3,
    HI_KA = 4,
    TWO = 5,
    THREE = 6,
    FOUR = 7,
    FIVE = 8,
    SIX = 9,
    EIGHT = 10,
    TEN = 11,
}
declare const ColorPiece_base: Immutable.Record.Factory<{
    color: Color;
    piece: Piece;
}>;
export declare class ColorPiece extends ColorPiece_base implements USIStringifyable, CSAStringifyable {
    static readonly _: ColorPiece;
    static from(color: Color, piece: Piece): ColorPiece;
    static from(cp: {
        color: Color;
        piece: Piece;
    }): ColorPiece;
    static black(piece: Piece): ColorPiece;
    static white(piece: Piece): ColorPiece;
    toCSAString(): string;
    toUSIString(): string;
    toString(): string;
}
export declare class Board implements Immutable.ValueObject, USIStringifyable, CSAStringifyable {
    private _map;
    static readonly WIDTH: number;
    static readonly HEIGHT: number;
    static preset(h: Handicap): Board;
    constructor(_map?: Immutable.Map<Position, ColorPiece>);
    readonly map: Immutable.Map<Position, ColorPiece>;
    set(pos: PositionLike, sp: ColorPiece): Board;
    get(pos: PositionLike): ColorPiece | null;
    has(pos: PositionLike): boolean;
    delete(pos: PositionLike): Board;
    [Symbol.iterator](): IterableIterator<[Position, ColorPiece | null]>;
    toCSAString(): string;
    toUSIString(): string;
    equals(other: any): boolean;
    hashCode(): number;
}
export declare class Hand implements Immutable.ValueObject {
    private _map;
    constructor(_map?: Immutable.Map<Piece, number>);
    readonly map: Immutable.Map<Piece, number>;
    set(p: Piece, n: number): Hand;
    get(p: Piece): number;
    has(p: Piece): boolean;
    inc(p: Piece, dn?: number): Hand;
    dec(p: Piece, dn?: number): Hand;
    equals(other: any): boolean;
    hashCode(): number;
    toCSAString(color: Color): string;
    toUSIString(color: Color): string;
}
declare const State_base: Immutable.Record.Factory<{
    board: Board;
    handBlack: Hand;
    handWhite: Hand;
    nextTurn: Color;
    moveNum: number;
}>;
export declare class State extends State_base implements USIStringifyable, CSAStringifyable {
    static preset(h: Handicap): State;
    getHand(color: Color): Hand;
    toCSAString(): string;
    toUSIString(): string;
    toSFEN(): string;
}
export declare type Time = DateTime | Interval | Duration;
export declare const DEFAULT_COMMON_EVENT_PROPS: {
    time: DateTime | Duration | Interval | null;
};
declare const StartEvent_base: Immutable.Record.Factory<{
    time: DateTime | Duration | Interval | null;
}>;
export declare class StartEvent extends StartEvent_base implements JapaneseNotationStringifyable {
    toJapaneseNotationString(): string;
}
declare const CSAMoveEvent_base: Immutable.Record.Factory<{
    color: Color;
    from: Position | null;
    to: Position;
    piece: Piece;
    time: DateTime | Duration | Interval | null;
}>;
/**
 * Standard (in this lib, CSA style) move event.
 */
export declare class CSAMoveEvent extends CSAMoveEvent_base implements CSAStringifyable {
    toCSAString(): string;
}
declare const USIMoveEvent_base: Immutable.Record.Factory<{
    src: Piece | Position;
    to: Position;
    promote: boolean;
    time: DateTime | Duration | Interval | null;
}>;
/**
 * USI style move event.
 */
export declare class USIMoveEvent extends USIMoveEvent_base implements USIStringifyable {
    toUSIString(): string;
}
export declare enum MovementNotation {
    DROPPED = 0,
    DOWNWARD = 1,
    HORIZONTALLY = 2,
    UPWARD = 3,
    FROM_RIGHT = 4,
    FROM_LEFT = 5,
    VERTICALLY = 6,
    UPWARD_FROM_RIGHT = 7,
    DOWNWARD_FROM_RIGHT = 8,
    UPWARD_FROM_LEFT = 9,
    DOWNWARD_FROM_LEFT = 10,
}
export declare const MOVEMENT_NOTATION_TO_JAPANESE_NOTATION_STRING: Immutable.Map<MovementNotation, string>;
export declare enum PromotionNotation {
    PROMOTE = 0,
    NOT_PROMOTE = 1,
}
export declare const PROMOTION_NOTATION_TO_JAPANESE_NOTATION_STRING: Immutable.Map<PromotionNotation, string>;
declare const JapaneseNotationMoveEvent_base: Immutable.Record.Factory<{
    color: Color;
    to: Position | "same";
    srcPiece: Piece;
    movement: MovementNotation | null;
    promote: PromotionNotation | null;
    time: DateTime | Duration | Interval | null;
}>;
/**
 * Japanese notation style move event.
 *
 * @see https://www.shogi.or.jp/faq/kihuhyouki.html
 */
export declare class JapaneseNotationMoveEvent extends JapaneseNotationMoveEvent_base implements JapaneseNotationStringifyable {
    toJapaneseNotationString(): string;
}
declare const ResignEvent_base: Immutable.Record.Factory<{
    color: Color;
    time: DateTime | Duration | Interval | null;
}>;
export declare class ResignEvent extends ResignEvent_base implements JapaneseNotationStringifyable {
    toJapaneseNotationString(): string;
}
export declare type MoveEvent = CSAMoveEvent | USIMoveEvent | JapaneseNotationMoveEvent;
export declare type Event = StartEvent | MoveEvent | ResignEvent;
export declare function isMoveEvent(e: Event): e is MoveEvent;
declare const RecordEventPointer_base: Immutable.Record.Factory<{
    forkIndex: number;
    eventIndex: number;
}>;
export declare class RecordEventPointer extends RecordEventPointer_base {
    isMainstream(): boolean;
    isEmptyEventIndex(): boolean;
    next(): RecordEventPointer;
    prev(): RecordEventPointer;
}
declare const RecordFork_base: Immutable.Record.Factory<{
    forkedFrom: RecordEventPointer;
    events: Immutable.List<Event>;
}>;
export declare class RecordFork extends RecordFork_base {
    static readonly MAINSTREAM: number;
    isForkedFromMainstream(): boolean;
}
declare const Record_base: Immutable.Record.Factory<{
    initialState: State;
    events: Immutable.List<Event>;
    forks: Immutable.List<RecordFork>;
}>;
export declare class Record extends Record_base {
    getEvent(p: RecordEventPointer): Event | Error;
    gatherForkPoints(forkIndex: number): RecordEventPointer[] | Error;
    iterateRev(forkIndex: number): IterableIterator<[RecordEventPointer, Event]>;
    getEventEntries(forkIndex: number): [RecordEventPointer, Event][];
    getEventPointers(forkIndex: number): RecordEventPointer[];
}
export interface CommonGameProps {
    readonly state: State;
}
export declare type GameReducer<Game extends CommonGameProps> = (game: Game, event: Event) => Game;
