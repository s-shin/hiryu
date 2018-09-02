import { Color, Piece } from "../definitions";
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
}): string;
