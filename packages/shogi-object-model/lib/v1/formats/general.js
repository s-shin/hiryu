"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
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
        [definitions_1.Piece.OU]: "王",
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
function stringifyPiece(p, opts = { style: Style.JA_ABBR }) {
    return pieceStrs[opts.style][p];
}
exports.stringifyPiece = stringifyPiece;
//# sourceMappingURL=general.js.map