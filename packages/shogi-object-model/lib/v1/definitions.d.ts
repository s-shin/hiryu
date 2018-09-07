export declare enum Piece {
    FU = "FU",
    KY = "KY",
    KE = "KE",
    GI = "GI",
    KI = "KI",
    KA = "KA",
    HI = "HI",
    OU = "OU",
    TO = "TO",
    NY = "NY",
    NK = "NK",
    NG = "NG",
    UM = "UM",
    RY = "RY"
}
export declare enum Color {
    BLACK = "BLACK",
    WHITE = "WHITE"
}
export interface ColorPiece {
    color: Color;
    piece: Piece;
}
export declare type SquareNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export declare type Square = [SquareNumber, SquareNumber];
export declare type Board = Array<null | ColorPiece>;
export interface Hand {
    FU: number;
    KY: number;
    KE: number;
    GI: number;
    KI: number;
    KA: number;
    HI: number;
    OU: number;
}
export interface Hands {
    black: Hand;
    white: Hand;
}
export declare enum EventType {
    MOVE = "MOVE",
    RESIGN = "RESIGN"
}
export interface CommonEventProps {
    type: EventType;
    time?: Date;
    elapsedTime?: number;
    forks?: EventList;
}
export declare enum Movement {
    DROPPED = "DROPPED",
    UPWARD = "UPWARD",
    DOWNWARD = "DOWNWARD",
    HORIZONTALLY = "HORIZONTALLY",
    FROM_RIGHT = "FROM_RIGHT",
    FROM_LEFT = "FROM_LEFT",
    VERTICALLY = "VERTICALLY"
}
export interface MoveEvent extends CommonEventProps {
    type: EventType.MOVE;
    color: Color;
    srcSquare?: Square | null;
    srcPiece?: Piece;
    dstSquare?: Square;
    dstPiece?: Piece;
    promote?: boolean;
    sameDstSquare?: boolean;
    movements?: Movement[];
}
export interface CompleteMoveEvent extends MoveEvent {
    srcSquare: Square | null;
    srcPiece: Piece;
    dstSquare: Square;
    dstPiece: Piece;
    promote: boolean;
    sameDstSquare: boolean;
    movements: Movement[];
}
export interface ResignEvent extends CommonEventProps {
    type: EventType.RESIGN;
    color: Color;
}
export declare type Event = MoveEvent | ResignEvent;
export declare type EventList = Event[];
export interface Player {
    name: string;
}
export interface Players {
    black: Player;
    white: Player;
}
export declare enum Handicap {
    NONE = "NONE",
    KY = "KY",
    RIGHT_KY = "RIGHT_KY",
    KA = "KA",
    HI = "HI",
    HI_KY = "HI_KY",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FIVE = "FIVE",
    SIX = "SIX",
    SEVEN = "SEVEN",
    EIGHT = "EIGHT",
    NINE = "NINE",
    TEN = "TEN"
}
export interface State {
    hands: Hands;
    board: Board;
    nextTurn: Color;
}
export interface StartingSetup {
    handicap?: Handicap;
    state?: State;
}
export interface Record {
    competition: string;
    location: string;
    startingTime?: Date;
    players?: Players;
    startingSetup: StartingSetup;
    events: EventList;
}
export declare const MIN_SQUARE_NUMBER: SquareNumber;
export declare const MAX_SQUARE_NUMBER: SquareNumber;
export declare function getSquareNumbers(): SquareNumber[];
export declare const SQUARE_NUMBERS: SquareNumber[];
export declare const SQUARE_NUMBERS_DESC: SquareNumber[];
export declare function getEmptyBoard(): Board;
export declare const EMPTY_BOARD: (ColorPiece | null)[];
export declare function getHirateBoard(): Board;
export declare const HIRATE_BOARD: (ColorPiece | null)[];
export declare function getEmptyHand(): Hand;
export declare const EMPTY_HAND: Hand;
export declare function getEmptyHands(): Hands;
export declare const EMPTY_HANDS: Hands;
export declare function getHirateState(): State;
export declare const HIRATE_STATE: State;
export declare function promote(piece: Piece, alt?: Piece): Piece | undefined;
export declare function demote(piece: Piece, alt?: Piece): Piece | undefined;
export declare function canPromote(piece: Piece): boolean;
export declare function isPromoted(piece: Piece): boolean;
export declare function flipPiece(piece: Piece, alt?: Piece): Piece | undefined;
export declare function flipColor(color: Color): Color;
export declare function colorPieceEquals(cp1: ColorPiece, cp2: ColorPiece): boolean;
export declare function squareToBoardIndex(sq: Square): number;
export declare function boardIndexToSquare(boardIndex: number): Square;
export declare function cloneSquare(sq: Square): Square;
export declare function isSquareNumber(n: number): n is SquareNumber;
export declare function isSquare(sqLike: number[]): sqLike is Square;
export declare function flipSquare(sq: Square): [SquareNumber, SquareNumber];
export declare function squareEquals(sq1: Square, sq2: Square): boolean;
export declare function getBoardSquare(board: Board, sq: Square): ColorPiece | null;
export declare function forEachBoardSquare(board: Board, cb: (cp: ColorPiece | null, sq: Square) => any): void;
export declare function findBoardSquare(board: Board, cond: (cp: ColorPiece | null, sq: Square) => boolean): [ColorPiece | null, Square] | null;
export declare function filterBoardSquare(board: Board, cond: (cp: ColorPiece | null, sq: Square) => boolean): Array<[ColorPiece | null, Square]>;
export declare function setBoardSquare(board: Board, sq: Square, cp: ColorPiece | null): void;
export declare function cloneBoard(board: Board): Board;
export declare function pieceToKeyOfHand(piece: Piece): "FU" | "KY" | "KE" | "GI" | "KI" | "KA" | "HI" | "OU";
export declare function getNumPieces(hand: Hand, piece: Piece): number;
export declare function addNumPieces(hand: Hand, piece: Piece, delta: number): void;
export declare function colorToKeyOfHands(color: Color): "black" | "white";
export declare function getHand(hands: Hands, color: Color): Hand;
export declare function cloneHand(hand: Hand): Hand;
export declare function cloneHands(hand: Hands): Hands;
export declare function cloneState(state: State): State;
export declare function cloneEvent(event: Event): Event;
export declare function isCompleteMoveEvent(e: MoveEvent): e is CompleteMoveEvent;
export declare function newMoveEvent(color: Color, from: Square, to: Square, promote?: boolean): MoveEvent;
export declare function newDropEvent(color: Color, piece: Piece, to: Square): MoveEvent;
