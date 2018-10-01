"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
//------------------------------------------------------------------------------
// Schema Interfaces
//------------------------------------------------------------------------------
var Piece;
(function (Piece) {
    Piece["FU"] = "FU";
    Piece["KY"] = "KY";
    Piece["KE"] = "KE";
    Piece["GI"] = "GI";
    Piece["KI"] = "KI";
    Piece["KA"] = "KA";
    Piece["HI"] = "HI";
    Piece["OU"] = "OU";
    Piece["TO"] = "TO";
    Piece["NY"] = "NY";
    Piece["NK"] = "NK";
    Piece["NG"] = "NG";
    Piece["UM"] = "UM";
    Piece["RY"] = "RY";
})(Piece = exports.Piece || (exports.Piece = {}));
var Color;
(function (Color) {
    Color["BLACK"] = "BLACK";
    Color["WHITE"] = "WHITE";
})(Color = exports.Color || (exports.Color = {}));
var EventType;
(function (EventType) {
    EventType["MOVE"] = "MOVE";
    EventType["RESIGN"] = "RESIGN";
})(EventType = exports.EventType || (exports.EventType = {}));
var Movement;
(function (Movement) {
    Movement["DROPPED"] = "DROPPED";
    Movement["UPWARD"] = "UPWARD";
    Movement["DOWNWARD"] = "DOWNWARD";
    Movement["HORIZONTALLY"] = "HORIZONTALLY";
    Movement["FROM_RIGHT"] = "FROM_RIGHT";
    Movement["FROM_LEFT"] = "FROM_LEFT";
    Movement["VERTICALLY"] = "VERTICALLY";
})(Movement = exports.Movement || (exports.Movement = {}));
var Handicap;
(function (Handicap) {
    Handicap["NONE"] = "NONE";
    Handicap["KY"] = "KY";
    Handicap["RIGHT_KY"] = "RIGHT_KY";
    Handicap["KA"] = "KA";
    Handicap["HI"] = "HI";
    Handicap["HI_KY"] = "HI_KY";
    Handicap["TWO"] = "TWO";
    Handicap["THREE"] = "THREE";
    Handicap["FOUR"] = "FOUR";
    Handicap["FIVE"] = "FIVE";
    Handicap["SIX"] = "SIX";
    Handicap["SEVEN"] = "SEVEN";
    Handicap["EIGHT"] = "EIGHT";
    Handicap["NINE"] = "NINE";
    Handicap["TEN"] = "TEN";
})(Handicap = exports.Handicap || (exports.Handicap = {}));
//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------
exports.MIN_SQUARE_NUMBER = 1;
exports.MAX_SQUARE_NUMBER = 9;
function getSquareNumbers() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
exports.getSquareNumbers = getSquareNumbers;
exports.SQUARE_NUMBERS = getSquareNumbers();
exports.SQUARE_NUMBERS_DESC = getSquareNumbers().reverse();
function getEmptyBoard() {
    return Array(81).fill(null);
}
exports.getEmptyBoard = getEmptyBoard;
exports.EMPTY_BOARD = getEmptyBoard();
function getHirateBoard() {
    return [
        { color: Color.WHITE, piece: Piece.KY },
        { color: Color.WHITE, piece: Piece.KE },
        { color: Color.WHITE, piece: Piece.GI },
        { color: Color.WHITE, piece: Piece.KI },
        { color: Color.WHITE, piece: Piece.OU },
        { color: Color.WHITE, piece: Piece.KI },
        { color: Color.WHITE, piece: Piece.GI },
        { color: Color.WHITE, piece: Piece.KE },
        { color: Color.WHITE, piece: Piece.KY },
        null,
        { color: Color.WHITE, piece: Piece.HI },
        null, null, null, null, null,
        { color: Color.WHITE, piece: Piece.KA },
        null,
        { color: Color.WHITE, piece: Piece.FU },
        { color: Color.WHITE, piece: Piece.FU },
        { color: Color.WHITE, piece: Piece.FU },
        { color: Color.WHITE, piece: Piece.FU },
        { color: Color.WHITE, piece: Piece.FU },
        { color: Color.WHITE, piece: Piece.FU },
        { color: Color.WHITE, piece: Piece.FU },
        { color: Color.WHITE, piece: Piece.FU },
        { color: Color.WHITE, piece: Piece.FU },
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        { color: Color.BLACK, piece: Piece.FU },
        { color: Color.BLACK, piece: Piece.FU },
        { color: Color.BLACK, piece: Piece.FU },
        { color: Color.BLACK, piece: Piece.FU },
        { color: Color.BLACK, piece: Piece.FU },
        { color: Color.BLACK, piece: Piece.FU },
        { color: Color.BLACK, piece: Piece.FU },
        { color: Color.BLACK, piece: Piece.FU },
        { color: Color.BLACK, piece: Piece.FU },
        null,
        { color: Color.BLACK, piece: Piece.KA },
        null, null, null, null, null,
        { color: Color.BLACK, piece: Piece.HI },
        null,
        { color: Color.BLACK, piece: Piece.KY },
        { color: Color.BLACK, piece: Piece.KE },
        { color: Color.BLACK, piece: Piece.GI },
        { color: Color.BLACK, piece: Piece.KI },
        { color: Color.BLACK, piece: Piece.OU },
        { color: Color.BLACK, piece: Piece.KI },
        { color: Color.BLACK, piece: Piece.GI },
        { color: Color.BLACK, piece: Piece.KE },
        { color: Color.BLACK, piece: Piece.KY },
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
        nextTurn: Color.BLACK,
    };
}
exports.getHirateState = getHirateState;
exports.HIRATE_STATE = getHirateState();
//------------------------------------------------------------------------------
// Methods
//------------------------------------------------------------------------------
const PROMOTE_MAP = {
    [Piece.FU]: Piece.TO,
    [Piece.KY]: Piece.NY,
    [Piece.KE]: Piece.NK,
    [Piece.GI]: Piece.NG,
    [Piece.KA]: Piece.UM,
    [Piece.HI]: Piece.RY,
};
const DEMOTE_MAP = util_1.flipObject(PROMOTE_MAP);
function promote(piece, alt) {
    return PROMOTE_MAP[piece] || alt;
}
exports.promote = promote;
function demote(piece, alt) {
    return DEMOTE_MAP[piece] || alt;
}
exports.demote = demote;
function canPromote(piece) {
    return promote(piece) !== undefined;
}
exports.canPromote = canPromote;
function isPromoted(piece) {
    return demote(piece) !== undefined;
}
exports.isPromoted = isPromoted;
function flipPiece(piece, alt) {
    return promote(piece) || demote(piece) || alt;
}
exports.flipPiece = flipPiece;
function isHeads(piece) {
    return canPromote(piece) || piece === Piece.KI || piece === Piece.OU;
}
exports.isHeads = isHeads;
// === Color Methods ===
function flipColor(color) {
    return color === Color.BLACK ? Color.WHITE : Color.BLACK;
}
exports.flipColor = flipColor;
// === ColorPiece Methods ===
function colorPieceEquals(cp1, cp2) {
    return cp1.color === cp2.color && cp1.piece === cp2.piece;
}
exports.colorPieceEquals = colorPieceEquals;
// === Square Methods ===
function squareToBoardIndex(sq) {
    return (9 - sq[0]) + (sq[1] - 1) * 9;
}
exports.squareToBoardIndex = squareToBoardIndex;
function boardIndexToSquare(boardIndex) {
    const x = 9 - boardIndex % 9;
    return [x, Math.floor((boardIndex - (9 - x)) / 9) + 1];
}
exports.boardIndexToSquare = boardIndexToSquare;
function cloneSquare(sq) {
    return [sq[0], sq[1]];
}
exports.cloneSquare = cloneSquare;
function isSquareNumber(n) {
    return exports.MIN_SQUARE_NUMBER <= n && n <= exports.MAX_SQUARE_NUMBER;
}
exports.isSquareNumber = isSquareNumber;
function isSquare(sqLike) {
    return sqLike.length === 2 && isSquareNumber(sqLike[0]) && isSquareNumber(sqLike[1]);
}
exports.isSquare = isSquare;
function flipSquare(sq) {
    return [exports.MAX_SQUARE_NUMBER - sq[0] + 1, exports.MAX_SQUARE_NUMBER - sq[1] + 1];
}
exports.flipSquare = flipSquare;
function squareEquals(sq1, sq2) {
    return sq1[0] === sq2[0] && sq1[1] === sq2[1];
}
exports.squareEquals = squareEquals;
// === Board Methods ===
function getBoardSquare(board, sq) {
    return board[squareToBoardIndex(sq)];
}
exports.getBoardSquare = getBoardSquare;
function forEachBoardSquare(board, cb) {
    for (const y of exports.SQUARE_NUMBERS) {
        for (const x of exports.SQUARE_NUMBERS) {
            const sq = [x, y];
            const cp = board[squareToBoardIndex(sq)];
            if (cb(cp, sq) === false) {
                return;
            }
        }
    }
}
exports.forEachBoardSquare = forEachBoardSquare;
function findBoardSquare(board, cond) {
    let r = null;
    forEachBoardSquare(board, (cp, sq) => {
        if (cond(cp, sq)) {
            r = [cp, sq];
        }
    });
    return r;
}
exports.findBoardSquare = findBoardSquare;
function filterBoardSquare(board, cond) {
    const r = [];
    forEachBoardSquare(board, (cp, sq) => {
        if (cond(cp, sq)) {
            r.push([cp, sq]);
        }
    });
    return r;
}
exports.filterBoardSquare = filterBoardSquare;
function setBoardSquare(board, sq, cp) {
    board[squareToBoardIndex(sq)] = cp;
}
exports.setBoardSquare = setBoardSquare;
function cloneBoard(board) {
    return [...board];
}
exports.cloneBoard = cloneBoard;
// === Hand(s) Methods ===
function pieceToKeyOfHand(piece) {
    return piece;
}
exports.pieceToKeyOfHand = pieceToKeyOfHand;
function getNumPieces(hand, piece) {
    return hand[pieceToKeyOfHand(piece)];
}
exports.getNumPieces = getNumPieces;
function addNumPieces(hand, piece, delta) {
    hand[pieceToKeyOfHand(piece)] += delta;
}
exports.addNumPieces = addNumPieces;
function colorToKeyOfHands(color) {
    return color.toLowerCase();
}
exports.colorToKeyOfHands = colorToKeyOfHands;
function getHand(hands, color) {
    return hands[colorToKeyOfHands(color)];
}
exports.getHand = getHand;
function cloneHand(hand) {
    return Object.assign({}, hand);
}
exports.cloneHand = cloneHand;
function cloneHands(hand) {
    return {
        black: cloneHand(hand.black),
        white: cloneHand(hand.white),
    };
}
exports.cloneHands = cloneHands;
// === State Methods ===
function cloneState(state) {
    return {
        board: cloneBoard(state.board),
        hands: cloneHands(state.hands),
        nextTurn: state.nextTurn,
    };
}
exports.cloneState = cloneState;
// === Event Methods ===
function cloneEvent(event) {
    return Object.assign({}, event);
}
exports.cloneEvent = cloneEvent;
function isCompleteMoveEvent(e) {
    return e.srcSquare !== undefined && e.srcPiece !== undefined
        && e.dstSquare !== undefined && e.dstPiece !== undefined
        && e.promote !== undefined && e.sameDstSquare !== undefined
        && e.movements !== undefined;
}
exports.isCompleteMoveEvent = isCompleteMoveEvent;
function newMoveEvent(color, from, to, promote = false) {
    const e = {
        type: EventType.MOVE,
        color,
        srcSquare: from,
        dstSquare: to,
        promote,
    };
    return e;
}
exports.newMoveEvent = newMoveEvent;
function newDropEvent(color, piece, to) {
    const e = {
        type: EventType.MOVE,
        color,
        srcSquare: null,
        srcPiece: piece,
        dstSquare: to,
        dstPiece: piece,
    };
    return e;
}
exports.newDropEvent = newDropEvent;
//# sourceMappingURL=definitions.js.map