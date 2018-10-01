"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
const util_1 = require("../../util");
const PIECE_TO_USI_STRING = {
    [definitions_1.Piece.FU]: "P",
    [definitions_1.Piece.KY]: "L",
    [definitions_1.Piece.KE]: "N",
    [definitions_1.Piece.GI]: "S",
    [definitions_1.Piece.KI]: "G",
    [definitions_1.Piece.KA]: "B",
    [definitions_1.Piece.HI]: "R",
    [definitions_1.Piece.OU]: "K",
    [definitions_1.Piece.TO]: "+P",
    [definitions_1.Piece.NY]: "+L",
    [definitions_1.Piece.NK]: "+N",
    [definitions_1.Piece.NG]: "+S",
    [definitions_1.Piece.UM]: "+B",
    [definitions_1.Piece.RY]: "+R",
};
const USI_STRING_TO_PIECE = util_1.flipObject(PIECE_TO_USI_STRING);
function stringifyPiece(piece) {
    return PIECE_TO_USI_STRING[piece];
}
exports.stringifyPiece = stringifyPiece;
function parsePiece(s, asColor = definitions_1.Color.BLACK) {
    const piece = USI_STRING_TO_PIECE[asColor === definitions_1.Color.BLACK ? s : s.toUpperCase()];
    if (!piece) {
        return null;
    }
    return piece;
}
exports.parsePiece = parsePiece;
function stringifyColor(color) {
    return color === definitions_1.Color.BLACK ? "b" : "w";
}
exports.stringifyColor = stringifyColor;
function parseColor(s) {
    const color = s === "b" ? definitions_1.Color.BLACK : s === "w" ? definitions_1.Color.WHITE : null;
    if (!color) {
        return null;
    }
    return color;
}
exports.parseColor = parseColor;
function stringifyColorPiece(cp) {
    const s = stringifyPiece(cp.piece);
    return cp.color === definitions_1.Color.BLACK ? s : s.toLowerCase();
}
exports.stringifyColorPiece = stringifyColorPiece;
function parseColorPiece(s) {
    {
        const piece = parsePiece(s);
        if (piece) {
            return { color: definitions_1.Color.BLACK, piece };
        }
    }
    {
        const piece = parsePiece(s, definitions_1.Color.WHITE);
        if (piece) {
            return { color: definitions_1.Color.WHITE, piece };
        }
    }
    return null;
}
exports.parseColorPiece = parseColorPiece;
function stringifySquare(pos) {
    return pos[0] + String.fromCharCode("a".charCodeAt(0) + (pos[1] - 1));
}
exports.stringifySquare = stringifySquare;
function parseSquare(s) {
    if (s.length !== 2) {
        return null;
    }
    const x = Number(s[0]);
    const y = s[1].charCodeAt(0) - "a".charCodeAt(0) + 1;
    if (definitions_1.MIN_SQUARE_NUMBER <= x &&
        x <= definitions_1.MAX_SQUARE_NUMBER &&
        definitions_1.MIN_SQUARE_NUMBER <= y &&
        y <= definitions_1.MAX_SQUARE_NUMBER) {
        return [x, y];
    }
    return null;
}
exports.parseSquare = parseSquare;
function stringifyBoard(board) {
    const rows = [];
    for (const y of definitions_1.SQUARE_NUMBERS) {
        const row = [];
        let space = 0;
        for (let x = definitions_1.MAX_SQUARE_NUMBER; x >= definitions_1.MIN_SQUARE_NUMBER; x--) {
            const cp = definitions_1.getBoardSquare(board, [x, y]);
            if (cp === null) {
                space++;
            }
            else {
                if (space > 0) {
                    row.push(`${space}`);
                    space = 0;
                }
                row.push(stringifyColorPiece(cp));
            }
        }
        if (space > 0) {
            row.push(`${space}`);
        }
        rows.push(row.join(""));
    }
    return rows.join("/");
}
exports.stringifyBoard = stringifyBoard;
function parseBoard(s) {
    const board = definitions_1.getEmptyBoard();
    let sqrIdx = 0;
    let i = 0;
    while (i < s.length) {
        let cpStr = s[i++];
        if (cpStr === "/") {
            if (sqrIdx > 0 && sqrIdx % 9 !== 0) {
                return null;
            }
            continue;
        }
        {
            const spaces = Number(cpStr);
            if (!isNaN(spaces)) {
                if (definitions_1.MIN_SQUARE_NUMBER <= spaces && spaces <= definitions_1.MAX_SQUARE_NUMBER) {
                    sqrIdx += spaces;
                    continue;
                }
                else {
                    return null;
                }
            }
        }
        if (cpStr === "+") {
            i++;
            if (i >= s.length) {
                return null;
            }
            cpStr += s[i];
        }
        board[sqrIdx++] = parseColorPiece(cpStr);
    }
    if (sqrIdx !== 81) {
        return null;
    }
    return board;
}
exports.parseBoard = parseBoard;
function stringifyHand(hand, color = definitions_1.Color.BLACK) {
    const ss = [];
    for (const piece of [definitions_1.Piece.FU, definitions_1.Piece.KY, definitions_1.Piece.KE, definitions_1.Piece.GI, definitions_1.Piece.KI, definitions_1.Piece.KA, definitions_1.Piece.HI]) {
        const n = hand[piece];
        if (n === 0) {
            continue;
        }
        const s = stringifyColorPiece({ color, piece });
        ss.push(n >= 2 ? n : "");
        ss.push(s);
    }
    return ss.join("");
}
exports.stringifyHand = stringifyHand;
function stringifyHands(hands) {
    const s = stringifyHand(hands.black, definitions_1.Color.BLACK) + stringifyHand(hands.white, definitions_1.Color.WHITE);
    return s.length > 0 ? s : "-";
}
exports.stringifyHands = stringifyHands;
function parseHands(s) {
    const hands = definitions_1.getEmptyHands();
    if (s === "-") {
        return hands;
    }
    for (let i = 0; i < s.length; i++) {
        let cpStr = s[i];
        let n = Number(cpStr);
        if (!isNaN(n)) {
            if (++i >= s.length) {
                return null;
            }
            cpStr = s[i + 1];
        }
        else {
            n = 1;
        }
        const cp = parseColorPiece(cpStr);
        if (!cp) {
            return null;
        }
        hands[definitions_1.colorToKeyOfHands(cp.color)][definitions_1.pieceToKeyOfHand(cp.piece)] = n;
    }
    return hands;
}
exports.parseHands = parseHands;
function stringifyState(state) {
    return [
        stringifyBoard(state.board),
        stringifyColor(state.nextTurn),
        stringifyHands(state.hands),
    ].join(" ");
}
exports.stringifyState = stringifyState;
function parseState(s) {
    const ss = s.split(" ");
    if (ss.length !== 3) {
        return null;
    }
    const board = parseBoard(ss[0]);
    const color = parseColor(ss[1]);
    const hands = parseHands(ss[2]);
    if (!board || !color || !hands) {
        return null;
    }
    return { board, hands, nextTurn: color };
}
exports.parseState = parseState;
function stringifySFEN(sfen) {
    return [stringifyState(sfen.state), sfen.nextMoveNum].join(" ");
}
exports.stringifySFEN = stringifySFEN;
function parseSFEN(s) {
    const ss = s.split(" ");
    if (ss.length !== 4) {
        return null;
    }
    const state = parseState(ss.slice(0, 3).join(" "));
    const nextMoveNum = Number(ss[3]);
    if (isNaN(nextMoveNum)) {
        return null;
    }
    if (!state) {
        return null;
    }
    return { state, nextMoveNum };
}
exports.parseSFEN = parseSFEN;
const SFEN_STRS = {
    [definitions_1.Handicap.NONE]: "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
    [definitions_1.Handicap.KY]: "lnsgkgsn1/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.RIGHT_KY]: "1nsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.KA]: "lnsgkgsnl/1r7/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.HI]: "lnsgkgsnl/7b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.HI_KY]: "lnsgkgsn1/7b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.TWO]: "lnsgkgsnl/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.THREE]: "lnsgkgsn1/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.FOUR]: "1nsgkgsn1/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.FIVE]: "2sgkgsn1/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.SIX]: "2sgkgs2/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.SEVEN]: "3gkgs2/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.EIGHT]: "3gkg3/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.NINE]: "4kg3/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
    [definitions_1.Handicap.TEN]: "4k4/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
};
function getSFENString(h) {
    return SFEN_STRS[h];
}
exports.getSFENString = getSFENString;
function getSFEN(h) {
    return parseSFEN(getSFENString(h));
}
exports.getSFEN = getSFEN;
function parseMove(s) {
    const len = s.length;
    if (len < 4 || 5 < len) {
        throw new Error("parseMove: invalid Move string");
    }
    const src = s.slice(0, 2);
    const srcSquare = parseSquare(src) || undefined;
    let srcPiece;
    if (!srcSquare) {
        // try to parse src as drop
        const piece = parsePiece(src[0]);
        if (!piece) {
            return null;
        }
        srcPiece = piece;
    }
    const dst = s.slice(2, 4);
    const dstSquare = parseSquare(dst);
    if (!dstSquare) {
        return null;
    }
    let promote;
    if (len === 5) {
        if (s[4] !== "+") {
            throw new Error("parseMove: invalid Move string");
        }
        promote = true;
    }
    return { srcSquare, srcPiece, dstSquare, promote };
}
exports.parseMove = parseMove;
function stringifyMove(move) {
    const buf = [];
    if (move.srcSquare) {
        buf.push(stringifySquare(move.srcSquare));
    }
    else if (move.srcPiece) {
        buf.push(stringifyPiece(move.srcPiece));
        buf.push("*");
    }
    else {
        throw new Error("stringifyMove: invalid Move object");
    }
    buf.push(stringifySquare(move.dstSquare));
    if (move.promote) {
        buf.push("+");
    }
    return buf.join("");
}
exports.stringifyMove = stringifyMove;
//# sourceMappingURL=usi.js.map