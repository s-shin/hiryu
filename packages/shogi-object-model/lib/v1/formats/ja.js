"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
const zenNumTable = "０１２３４５６７８９".split("").reduce((p, c, i) => ({
    zen2num: Object.assign({}, p.zen2num, { [c]: i }),
    num2zen: Object.assign({}, p.num2zen, { [i]: c }),
}), { zen2num: {}, num2zen: {} });
const kanNumTable = "〇一二三四五六七八九十".split("").reduce((p, c, i) => ({
    kan2num: Object.assign({}, p.kan2num, { [c]: i }),
    num2kan: Object.assign({}, p.num2kan, { [i]: c }),
}), { kan2num: {}, num2kan: {} });
//! 0-99 → 〇〜九十九
function num2kan(n) {
    if (n >= 100 || n < 0) {
        return null;
    }
    if (n === 0) {
        return "〇";
    }
    const d2 = Math.floor(n * 0.1) % 10;
    const d1 = n % 10;
    return [
        d2 > 1 ? kanNumTable.num2kan[d2] : "",
        d2 > 0 ? kanNumTable.num2kan[10] : "",
        d1 > 0 ? kanNumTable.num2kan[d1] : "",
    ].join("");
}
exports.num2kan = num2kan;
//! 〇〜九 → 0-9
function kan2num(s) {
    if (s.length !== 1) {
        throw new Error("invalid argument");
    }
    const r = kanNumTable.kan2num[s];
    return r !== undefined ? r : null;
}
exports.kan2num = kan2num;
//! 12345 → １２３４５
function num2zen(n) {
    if (n < 0) {
        return null;
    }
    if (n === 0) {
        return "０";
    }
    const ss = [];
    for (let x = Math.floor(n); x !== 0; x = Math.floor(x * 0.1)) {
        ss.unshift(zenNumTable.num2zen[x % 10]);
    }
    return ss.join("");
}
exports.num2zen = num2zen;
//! ０〜９ → 0-9
function zen2num(s) {
    if (s.length !== 1) {
        return null;
    }
    const r = zenNumTable.zen2num[s];
    return r !== undefined ? r : null;
}
exports.zen2num = zen2num;
//---
var ColorFormatStyle;
(function (ColorFormatStyle) {
    ColorFormatStyle[ColorFormatStyle["DEFAULT"] = 0] = "DEFAULT";
    ColorFormatStyle[ColorFormatStyle["TRIANGLE"] = 1] = "TRIANGLE";
})(ColorFormatStyle = exports.ColorFormatStyle || (exports.ColorFormatStyle = {}));
const colorStrs = {
    [ColorFormatStyle.DEFAULT]: {
        [definitions_1.Color.BLACK]: "☗",
        [definitions_1.Color.WHITE]: "☖",
    },
    [ColorFormatStyle.TRIANGLE]: {
        [definitions_1.Color.BLACK]: "▲",
        [definitions_1.Color.WHITE]: "△",
    },
};
function stringifyColor(c, opts = { style: ColorFormatStyle.DEFAULT }) {
    return colorStrs[opts.style][c];
}
exports.stringifyColor = stringifyColor;
function parseColor(s, opts = { style: ColorFormatStyle.DEFAULT }) {
    throw new Error("TODO");
}
exports.parseColor = parseColor;
const pieceStrs = {
    [0 /* LONG */]: {
        [definitions_1.Piece.FU]: "歩兵",
        [definitions_1.Piece.KY]: "香車",
        [definitions_1.Piece.KE]: "桂馬",
        [definitions_1.Piece.GI]: "銀将",
        [definitions_1.Piece.KI]: "金将",
        [definitions_1.Piece.KA]: "角行",
        [definitions_1.Piece.HI]: "飛車",
        [definitions_1.Piece.OU]: { default: "王将", [0 /* GYOKU */]: "玉将" },
        [definitions_1.Piece.TO]: "と金",
        [definitions_1.Piece.NY]: "成香",
        [definitions_1.Piece.NK]: "成桂",
        [definitions_1.Piece.NG]: "成銀",
        [definitions_1.Piece.UM]: "龍馬",
        [definitions_1.Piece.RY]: "龍王",
    },
    [1 /* ABBR */]: {
        [definitions_1.Piece.FU]: "歩",
        [definitions_1.Piece.KY]: "香",
        [definitions_1.Piece.KE]: "桂",
        [definitions_1.Piece.GI]: "銀",
        [definitions_1.Piece.KI]: "金",
        [definitions_1.Piece.KA]: "角",
        [definitions_1.Piece.HI]: "飛",
        [definitions_1.Piece.OU]: { default: "王", [0 /* GYOKU */]: "玉" },
        [definitions_1.Piece.TO]: "と",
        [definitions_1.Piece.NY]: "杏",
        [definitions_1.Piece.NK]: "圭",
        [definitions_1.Piece.NG]: "全",
        [definitions_1.Piece.UM]: "馬",
        [definitions_1.Piece.RY]: "龍",
    },
};
function stringifyPiece(p, opts = { style: 1 /* ABBR */, variants: [] }) {
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
function parsePiece(s, opts = { style: 1 /* ABBR */ }) {
    // TODO: performance
    const strs = pieceStrs[opts.style];
    for (const p of Object.keys(strs)) {
        const t = strs[p];
        if (typeof t === "string") {
            if (t === s) {
                return p;
            }
            continue;
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
//---
function stringifySquare(sq) {
    return num2zen(sq[0]) + num2kan(sq[1]);
}
exports.stringifySquare = stringifySquare;
function parseSquare(s) {
    if (s.length != 2) {
        return null;
    }
    const x = zen2num(s[0]);
    const y = kan2num(s[1]);
    return x && y ? [x, y] : null;
}
exports.parseSquare = parseSquare;
//---
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
    // TODO: performance
    for (const m of Object.keys(movementStrs)) {
        if (s === movementStrs[m]) {
            return m;
        }
    }
    return null;
}
exports.parseMovement = parseMovement;
//---
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
    // TODO: performance
    for (const h of Object.keys(handicapStrs)) {
        if (s === handicapStrs[h]) {
            return h;
        }
    }
    return null;
}
exports.parseHandicap = parseHandicap;
//---
function stringifyMoveEvent(e, opts = { withColor: false }) {
    const ss = [];
    if (opts.withColor) {
        ss.push(stringifyColor(e.color));
    }
    if (!e.dstSquare || !e.srcPiece || e.promote === undefined || e.sameDstSquare === undefined) {
        return null;
    }
    if (e.sameDstSquare) {
        ss.push("同　");
    }
    else {
        ss.push(stringifySquare(e.dstSquare));
    }
    ss.push(stringifyPiece(e.srcPiece));
    // TODO: movements
    if (e.promote) {
        ss.push("成");
    }
    return ss.join("");
}
exports.stringifyMoveEvent = stringifyMoveEvent;
function stringifyResignEvent(e, opts = { withColor: false }) {
    const ss = [];
    if (opts.withColor) {
        ss.push(stringifyColor(e.color));
    }
    ss.push("投了");
    return ss.join("");
}
exports.stringifyResignEvent = stringifyResignEvent;
function stringifyEvent(e, opts = { withColor: false }) {
    switch (e.type) {
        case definitions_1.EventType.MOVE: {
            return stringifyMoveEvent(e);
        }
        case definitions_1.EventType.RESIGN: {
            return stringifyResignEvent(e);
        }
    }
    return null;
}
exports.stringifyEvent = stringifyEvent;
//# sourceMappingURL=ja.js.map