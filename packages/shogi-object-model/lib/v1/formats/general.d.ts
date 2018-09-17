import { Color, Piece, Movement, Handicap } from "../definitions";
export declare function toKansuji(n: number): string;
export declare enum Style {
    JA = 0,
    JA_ABBR = 1,
    EN = 2,
    EN_ABBR = 3
}
export declare function stringifyColor(c: Color, opts?: {
    style: Style;
}): string;
export declare function stringifyPiece(p: Piece, opts?: {
    style: Style;
    variants: never[];
}): string;
export declare function parsePiece(s: string, opts?: {
    style: Style;
}): Piece | null;
export declare function stringifyMovement(m: Movement): string;
export declare function parseMovement(s: string): Movement | null;
export declare function stringifyHandicap(h: Handicap): string;
export declare function parseHandicap(s: string): Handicap | null;
