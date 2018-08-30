"use strict";
// import * as defs from "./definitions";
// import { flipObject } from "../util";
// 
// //------------------------------------------------------------------------------
// // Piece
// //------------------------------------------------------------------------------
// 
// const PROMOTE_MAP: {
//   [piece: string]: defs.Piece;
// } = {
//   [defs.Piece.FU]: defs.Piece.TO,
//   [defs.Piece.KY]: defs.Piece.NY,
//   [defs.Piece.KE]: defs.Piece.NK,
//   [defs.Piece.GI]: defs.Piece.NG,
//   [defs.Piece.KA]: defs.Piece.UM,
//   [defs.Piece.HI]: defs.Piece.RY,
// };
// 
// const DEMOTE_MAP: {
//   [piece: string]: defs.Piece;
// } = flipObject(PROMOTE_MAP);
// 
// export function promote(piece: defs.Piece): defs.Piece | undefined {
//   return PROMOTE_MAP[piece];
// }
// 
// export function demote(piece: defs.Piece): defs.Piece | undefined {
//   return DEMOTE_MAP[piece];
// }
// 
// export function canPromote(piece: defs.Piece) {
//   return promote(piece) !== undefined;
// }
// 
// export function isPromoted(piece: defs.Piece) {
//   return demote(piece) !== undefined;
// }
// 
// export function flipPiece(piece: defs.Piece, alt?: defs.Piece) {
//   return promote(piece) || demote(piece) || alt;
// }
// 
// //---
// 
// // export function pieceToCSAString(piece: defs.Piece) {
// //   return piece as string;
// // }
// //
// // export function csaStringToPiece(s: string) {
// //   return s in defs.Piece ? s as defs.Piece : undefined;
// // }
// 
// // const PIECE_TO_JAPANESE_NOTATION_STRING: {
// //   [piece: string]: string;
// // } = {
// //   [defs.Piece.FU]: "歩",
// //   [defs.Piece.KY]: "香",
// //   [defs.Piece.KE]: "桂",
// //   [defs.Piece.GI]: "銀",
// //   [defs.Piece.KI]: "金",
// //   [defs.Piece.KA]: "角",
// //   [defs.Piece.HI]: "飛",
// //   [defs.Piece.OU]: "玉",
// //   [defs.Piece.TO]: "と",
// //   [defs.Piece.NY]: "成香",
// //   [defs.Piece.NK]: "成桂",
// //   [defs.Piece.NG]: "成銀",
// //   [defs.Piece.UM]: "馬",
// //   [defs.Piece.RY]: "龍",
// // };
// //
// // const JAPANESE_NOTATION_STRING_TO_PIECE: {
// //   [s: string]: defs.Piece;
// // } = flipObject(PIECE_TO_JAPANESE_NOTATION_STRING);
// //
// // export function pieceToJapaneseNotationString(piece: defs.Piece): string {
// //   return PIECE_TO_JAPANESE_NOTATION_STRING[piece];
// // }
// //
// // export function japaneseNotationStringToPiece(s: string): defs.Piece | undefined {
// //   return JAPANESE_NOTATION_STRING_TO_PIECE[s];
// // }
// 
// //------------------------------------------------------------------------------
// // Color
// //------------------------------------------------------------------------------
// 
// export function flipColor(color: defs.Color) {
//   return color === defs.Color.BLACK ? defs.Color.WHITE : defs.Color.BLACK;
// }
// 
// //------------------------------------------------------------------------------
// // Square
// //------------------------------------------------------------------------------
// 
// export function squareToBoardIndex(sq: defs.Square) {
//   return (9 - sq[0]) + (sq[1] - 1) * 9;
// }
// 
// export function boardIndexToSquare(boardIndex: number): defs.Square {
//   const x = 9 - boardIndex % 9;
//   return [x, Math.floor((boardIndex - (9 - x)) / 9) + 1] as defs.Square;
// }
// 
// export function cloneSquare(sq: defs.Square): defs.Square {
//   return [sq[0], sq[1]];
// }
// 
// export function moveSquare(sq: defs.Square)
// 
// export function toSquare(sqLike: defs.SquareLike): defs.Square | null {
//   return sqLike[0]
// }
// 
// //------------------------------------------------------------------------------
// // Board
// //------------------------------------------------------------------------------
// 
// export function getSquare(board: defs.Board, sq: defs.Square) {
//   return board[squareToBoardIndex(sq)];
// }
// 
// export function cloneBoard(board: defs.Board): defs.Board {
//   return [...board];
// }
// 
// //------------------------------------------------------------------------------
// // Hand, Hands
// //------------------------------------------------------------------------------
// 
// export function pieceToKeyOfHand(piece: defs.Piece) {
//   return piece as keyof defs.Hand;
// }
// 
// export function colorToKeyOfHands(color: defs.Color) {
//   return color.toLowerCase() as keyof defs.Hands;
// }
// 
// export function cloneHand(hand: defs.Hand): defs.Hand {
//   return { ...hand };
// }
// 
// export function cloneHands(hand: defs.Hands): defs.Hands {
//   return {
//     black: cloneHand(hand.black),
//     white: cloneHand(hand.white),
//   };
// }
// 
// //------------------------------------------------------------------------------
// 
// // export function colorToCSAString(color: defs.Color) {
// //   return color === defs.Color.BLACK ? "+" : "-";
// // }
// //
// // export function csaStringToColor(s: string) {
// //   return s === "+" ? defs.Color.BLACK : (s === "-" ? defs.Color.WHITE : undefined);
// // }
// 
// // const BOARD_PRESETS: {
// //   [defs.Handicap]: defs.Board;
// // } = {
// //   [defs.Handicap.NONE]: [],
// // };
//# sourceMappingURL=_methods1.js.map