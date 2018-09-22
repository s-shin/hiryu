import { Color, Piece, Movement, Handicap, MoveEvent, Square, ResignEvent, Event } from "../definitions";
export declare function num2kan(n: number): string | null;
export declare function kan2num(s: string): number | null;
export declare function num2zen(n: number): string | null;
export declare function zen2num(s: string): number | null;
export declare enum ColorFormatStyle {
    DEFAULT = 0,
    TRIANGLE = 1
}
export declare function stringifyColor(c: Color, opts?: {
    style: ColorFormatStyle;
}): string;
export declare function parseColor(s: string, opts?: {
    style: ColorFormatStyle;
}): Color | null;
declare const enum PieceFormatStyle {
    LONG = 0,
    ABBR = 1
}
export declare function stringifyPiece(p: Piece, opts?: {
    style: PieceFormatStyle;
    variants: never[];
}): string;
export declare function parsePiece(s: string, opts?: {
    style: PieceFormatStyle;
}): Piece | null;
export declare function stringifySquare(sq: Square): string;
export declare function parseSquare(s: string): Square | null;
export declare function stringifyMovement(m: Movement): string;
export declare function parseMovement(s: string): Movement | null;
export declare function stringifyHandicap(h: Handicap): string;
export declare function parseHandicap(s: string): Handicap | null;
export declare function stringifyMoveEvent(e: MoveEvent, opts?: {
    withColor: boolean;
}): string | null;
export declare function stringifyResignEvent(e: ResignEvent, opts?: {
    withColor: boolean;
}): string;
export declare function stringifyEvent(e: Event, opts?: {
    withColor: boolean;
}): string | null;
export {};
