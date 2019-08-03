"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// CSA標準棋譜ファイル形式 v2.2
// http://www2.computer-shogi.org/protocol/record_v22.html
const paco_1 = require("@hiryu/paco");
const definitions_1 = require("../definitions");
function parseColor(s) {
    if (s === "+") {
        return definitions_1.Color.BLACK;
    }
    if (s === "-") {
        return definitions_1.Color.WHITE;
    }
    return null;
}
exports.parseColor = parseColor;
function parseSquare(s) {
    if (s.length !== 2) {
        return null;
    }
    const x = parseInt(s[0]);
    if (isNaN(x) || x === 0) {
        return null;
    }
    const y = parseInt(s[1]);
    if (isNaN(y) || x === 0) {
        return null;
    }
    return [x, y];
}
exports.parseSquare = parseSquare;
function parsePiece(s) {
    if (definitions_1.isPiece(s)) {
        return s;
    }
    return null;
}
exports.parsePiece = parsePiece;
exports.recordParser = (() => {
    const newline = paco_1.desc(paco_1.oneOf(paco_1.string("\r\n"), paco_1.char("\n")), "newline");
    const notNewline = paco_1.desc(paco_1.not(newline), "notNewline");
    const version = paco_1.desc(paco_1.string("V2.2"), "version");
    const versionLine = paco_1.desc(paco_1.transform(paco_1.seq(version, newline), vs => vs[0]), "versionLine");
    const blackPlayerLine = paco_1.desc(paco_1.transform(paco_1.seq(paco_1.string("N+"), paco_1.join(paco_1.many(notNewline)), newline), vs => vs[1]), "blackPlayer");
    const whitePlayerLine = paco_1.desc(paco_1.transform(paco_1.seq(paco_1.string("N-"), paco_1.join(paco_1.many(notNewline)), newline), vs => vs[1]), "whitePlayer");
    const playerLines = paco_1.desc(paco_1.transform(paco_1.seq(blackPlayerLine, whitePlayerLine), vs => {
        return {
            black: vs[0],
            white: vs[1],
        };
    }), "players");
    const metaEntry = paco_1.desc(paco_1.seq(paco_1.char("$"), paco_1.many1(notNewline)), "metaEntry");
    const metaEntryLine = paco_1.desc(paco_1.transform(paco_1.seq(metaEntry, newline), vs => vs[0]), "metaEntryLine");
    const setupLines = paco_1.desc(paco_1.many(paco_1.seq(paco_1.char("P"), paco_1.many(notNewline), newline)), "setup");
    const color = paco_1.desc(paco_1.transform(paco_1.charIn("+-"), v => parseColor(v)), "firstTurn");
    const squareNumber = paco_1.charIn("1234567890");
    const square = paco_1.desc(paco_1.transform(paco_1.join(paco_1.seq(squareNumber, squareNumber)), vs => parseSquare(vs)), "square");
    const piece = paco_1.desc(paco_1.oneOf(...definitions_1.PIECES.map(p => paco_1.constant(paco_1.string(p), p))), "piece");
    const firstTurnLine = paco_1.desc(paco_1.transform(paco_1.seq(color, newline), vs => vs[0]), "firstTurn");
    const moveLine = paco_1.desc(paco_1.transform(paco_1.seq(color, square, square, piece), vs => {
        return {};
    }), "moveLine");
    const timeLine = paco_1.desc(paco_1.seq(paco_1.char("T"), paco_1.many(notNewline), newline), "timeLine");
    const moveEvent = paco_1.seq(moveLine, paco_1.optional(timeLine, null));
    const specialLine = paco_1.desc(paco_1.transform(paco_1.seq(paco_1.char("%"), paco_1.oneOf(...["TORYO"].map(s => paco_1.string(s))), newline), vs => null), "specialLine");
    const record = paco_1.seq(paco_1.optional(versionLine, "TODO"), paco_1.optional(playerLines, null), paco_1.many(metaEntryLine), setupLines, firstTurnLine, paco_1.many(paco_1.oneOf(moveEvent, specialLine)));
    return record;
})();
function preprocessRecordData(data) {
    return data.replace(/($|\n)('[^\n]*|\s*)\r?\n/, "");
}
exports.preprocessRecordData = preprocessRecordData;
function parseRecord(data, log) {
    let t;
    if (log) {
        t = new paco_1.BasicParserTracer({
            level: "verbose",
            log,
        });
    }
    const r = paco_1.execute(exports.recordParser, new paco_1.StringReader(preprocessRecordData(data)), t);
    if (r.error) {
        return r.error;
    }
    const record = r.value;
    let c = definitions_1.Color.BLACK;
    for (const e of record.events) {
        e.color = c;
        c = flipColor(c);
    }
    return r.value;
}
exports.parseRecord = parseRecord;
//# sourceMappingURL=csa.js.map