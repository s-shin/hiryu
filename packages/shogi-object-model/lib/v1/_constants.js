"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("./definitions");
exports.MIN_SQUARE_NUMBER = 1;
exports.MAX_SQUARE_NUMBER = 9;
function getSquareNumbers() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
exports.getSquareNumbers = getSquareNumbers;
exports.SQUARE_NUMBERS = getSquareNumbers();
function getEmptyBoard() {
    return Array(81).fill(null);
}
exports.getEmptyBoard = getEmptyBoard;
exports.EMPTY_BOARD = getEmptyBoard();
function getHirateBoard() {
    return [
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.KY },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.KE },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.GI },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.KI },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.OU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.KI },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.GI },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.KE },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.KY },
        null,
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.HI },
        null, null, null, null, null,
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.KA },
        null,
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.WHITE, piece: definitions_1.Piece.FU },
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.FU },
        null,
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.KA },
        null, null, null, null, null,
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.HI },
        null,
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.KY },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.KE },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.GI },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.KI },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.OU },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.KI },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.GI },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.KE },
        { color: definitions_1.Color.BLACK, piece: definitions_1.Piece.KY },
    ];
}
exports.getHirateBoard = getHirateBoard;
exports.HIRATE_BOARD = getHirateBoard();
function getEmptyHand() {
    return {
        FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0, OU: 0,
    };
}
exports.getEmptyHand = getEmptyHand;
exports.EMPTY_HAND = getEmptyHand();
function getEmptyHands() {
    return {
        black: getEmptyHand(),
        white: getEmptyHand(),
    };
}
exports.getEmptyHands = getEmptyHands;
exports.EMPTY_HANDS = getEmptyHands();
function getHirateState() {
    return {
        board: getHirateBoard(),
        hands: getEmptyHands(),
        nextTurn: definitions_1.Color.BLACK,
    };
}
exports.getHirateState = getHirateState;
exports.HIRATE_STATE = getHirateState();
//# sourceMappingURL=_constants.js.map