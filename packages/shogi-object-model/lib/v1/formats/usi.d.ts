import { Board, Color, ColorPiece, Hand, Handicap, Hands, Piece, Square, State } from "../definitions";
export declare function stringifyPiece(piece: Piece): string;
export declare function parsePiece(s: string, asColor?: Color): Piece;
export declare function stringifyColor(color: Color): string;
export declare function parseColor(s: string): Color;
export declare function stringifyColorPiece(cp: ColorPiece): string;
export declare function parseColorPiece(s: string): ColorPiece;
export declare function stringifySquare(pos: Square): string;
export declare function parseSquare(s: string): Square;
export declare function stringifyBoard(board: Board): string;
export declare function parseBoard(s: string): Board;
export declare function stringifyHand(hand: Hand, color?: Color): string;
export declare function stringifyHands(hands: Hands): string;
export declare function parseHands(s: string): Hands;
export declare function stringifyState(state: State): string;
export declare function parseState(s: string): State;
export interface SFEN {
    state: State;
    nextMoveNum: number;
}
export declare function stringifySFEN(sfen: SFEN): string;
export declare function parseSFEN(s: string): SFEN;
export declare function getSFENString(h: Handicap): string;
export declare function getSFEN(h: Handicap): SFEN;
export interface Move {
    srcSquare?: Square;
    srcPiece?: Piece;
    dstSquare: Square;
    promote?: boolean;
}
export declare function parseMove(s: string): Move;
export declare function stringifyMove(move: Move): string;