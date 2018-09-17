"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
const kansujiStrs = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
function toKansuji(n) {
    const d2 = Math.floor(n * 0.1) % 10;
    const d1 = n % 10;
    return [
        d2 > 1 ? kansujiStrs[d2] : "",
        d2 > 0 ? kansujiStrs[10] : "",
        d1 > 0 ? kansujiStrs[d1] : "",
    ].join("");
}
exports.toKansuji = toKansuji;
var Style;
(function (Style) {
    Style[Style["JA"] = 0] = "JA";
    Style[Style["JA_ABBR"] = 1] = "JA_ABBR";
    Style[Style["EN"] = 2] = "EN";
    Style[Style["EN_ABBR"] = 3] = "EN_ABBR";
})(Style = exports.Style || (exports.Style = {}));
const colorStrs = {
    [Style.JA_ABBR]: {
        [definitions_1.Color.BLACK]: "☗",
        [definitions_1.Color.WHITE]: "☖",
    },
};
function stringifyColor(c, opts = { style: Style.JA_ABBR }) {
    return colorStrs[opts.style][c];
}
exports.stringifyColor = stringifyColor;
const pieceStrs = {
    [Style.JA]: {
        [definitions_1.Piece.FU]: "歩兵",
        [definitions_1.Piece.KY]: "香車",
        [definitions_1.Piece.KE]: "桂馬",
        [definitions_1.Piece.GI]: "銀将",
        [definitions_1.Piece.KI]: "金将",
        [definitions_1.Piece.KA]: "角行",
        [definitions_1.Piece.HI]: "飛車",
        [definitions_1.Piece.OU]: "王将",
        [definitions_1.Piece.TO]: "と金",
        [definitions_1.Piece.NY]: "成香",
        [definitions_1.Piece.NK]: "成桂",
        [definitions_1.Piece.NG]: "成銀",
        [definitions_1.Piece.UM]: "龍馬",
        [definitions_1.Piece.RY]: "龍王",
    },
    [Style.JA_ABBR]: {
        [definitions_1.Piece.FU]: "歩",
        [definitions_1.Piece.KY]: "香",
        [definitions_1.Piece.KE]: "桂",
        [definitions_1.Piece.GI]: "銀",
        [definitions_1.Piece.KI]: "金",
        [definitions_1.Piece.KA]: "角",
        [definitions_1.Piece.HI]: "飛",
        [definitions_1.Piece.OU]: { default: "王", gyoku: "玉" },
        [definitions_1.Piece.TO]: "と",
        [definitions_1.Piece.NY]: "杏",
        [definitions_1.Piece.NK]: "圭",
        [definitions_1.Piece.NG]: "全",
        [definitions_1.Piece.UM]: "馬",
        [definitions_1.Piece.RY]: "龍",
    },
    [Style.EN]: {
        [definitions_1.Piece.FU]: "pawn",
        [definitions_1.Piece.KY]: "lance",
        [definitions_1.Piece.KE]: "knight",
        [definitions_1.Piece.GI]: "silver",
        [definitions_1.Piece.KI]: "gold",
        [definitions_1.Piece.KA]: "bishop",
        [definitions_1.Piece.HI]: "rook",
        [definitions_1.Piece.OU]: "king",
        [definitions_1.Piece.TO]: "promoted pawn",
        [definitions_1.Piece.NY]: "promoted lance",
        [definitions_1.Piece.NK]: "promoted knight",
        [definitions_1.Piece.NG]: "promoted silver",
        [definitions_1.Piece.UM]: "promoted bishop",
        [definitions_1.Piece.RY]: "promoted rook",
    },
    [Style.EN_ABBR]: {
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
    },
};
function stringifyPiece(p, opts = { style: Style.JA_ABBR, variants: [] }) {
    const t = pieceStrs[opts.style][p];
    if (typeof t === "string") {
        return t;
    }
    for (const variant of [...opts.variants]) {
        const tt = t[variant];
        if (tt) {
            return tt;
        }
    }
    return t.default;
}
exports.stringifyPiece = stringifyPiece;
function parsePiece(s, opts = { style: Style.JA_ABBR }) {
    const strs = pieceStrs[opts.style];
    for (const p of Object.keys(strs)) {
        const t = strs[p];
        if (typeof t === "string") {
            return t === s ? p : null;
        }
        for (const variant of Object.keys(t)) {
            const tt = t[variant];
            if (tt === s) {
                return p;
            }
        }
    }
    return null;
}
exports.parsePiece = parsePiece;
const movementStrs = {
    [definitions_1.Movement.DROPPED]: "打",
    [definitions_1.Movement.UPWARD]: "上",
    [definitions_1.Movement.DOWNWARD]: "引",
    [definitions_1.Movement.HORIZONTALLY]: "寄",
    [definitions_1.Movement.FROM_RIGHT]: "右",
    [definitions_1.Movement.FROM_LEFT]: "左",
    [definitions_1.Movement.VERTICALLY]: "直",
};
function stringifyMovement(m) {
    return movementStrs[m];
}
exports.stringifyMovement = stringifyMovement;
function parseMovement(s) {
    for (const m of Object.keys(movementStrs)) {
        if (s === movementStrs[m]) {
            return m;
        }
    }
    return null;
}
exports.parseMovement = parseMovement;
const handicapStrs = {
    [definitions_1.Handicap.NONE]: "平手",
    [definitions_1.Handicap.KY]: "香落ち",
    [definitions_1.Handicap.RIGHT_KY]: "右香落ち",
    [definitions_1.Handicap.KA]: "角落ち",
    [definitions_1.Handicap.HI]: "飛車落ち",
    [definitions_1.Handicap.HI_KY]: "飛香落ち",
    [definitions_1.Handicap.TWO]: "二枚落ち",
    [definitions_1.Handicap.THREE]: "三枚落ち",
    [definitions_1.Handicap.FOUR]: "四枚落ち",
    [definitions_1.Handicap.FIVE]: "五枚落ち",
    [definitions_1.Handicap.SIX]: "六枚落ち",
    [definitions_1.Handicap.SEVEN]: "七枚落ち",
    [definitions_1.Handicap.EIGHT]: "八枚落ち",
    [definitions_1.Handicap.NINE]: "九枚落ち",
    [definitions_1.Handicap.TEN]: "十枚落ち",
};
function stringifyHandicap(h) {
    return handicapStrs[h];
}
exports.stringifyHandicap = stringifyHandicap;
function parseHandicap(s) {
    for (const h of Object.keys(handicapStrs)) {
        if (s === handicapStrs[h]) {
            return h;
        }
    }
    return null;
}
exports.parseHandicap = parseHandicap;
//# sourceMappingURL=general.js.map