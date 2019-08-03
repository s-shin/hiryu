import { Color, Square, Piece } from "../definitions";
export declare function parseColor(s: string): Color | null;
export declare function parseSquare(s: string): Square | null;
export declare function parsePiece(s: string): Piece | null;
export declare const recordParser: import("@hiryu/paco").Parser<[string, {
    black: string;
    white: string;
} | null, [string, string[]][], [string, string[], string][], Color, ([{}, [string, string[], string] | null] | null)[]]>;
export declare function preprocessRecordData(data: string): string;
export declare function parseRecord(data: string, log?: (msg: string) => void): Error | [string, {
    black: string;
    white: string;
} | null, [string, string[]][], [string, string[], string][], Color, ([{}, [string, string[], string] | null] | null)[]];
