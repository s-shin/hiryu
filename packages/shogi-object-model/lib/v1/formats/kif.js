"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const paco_1 = require("@hiryu/paco");
const definitions_1 = require("../definitions");
const jp = __importStar(require("./ja"));
// 棋譜ファイル KIF 形式: http://kakinoki.o.oo7.jp/kif_format.html
function detectEncoding(data) {
    // check BOM of UTF-8.
    if (data.length >= 3 && data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
        return "utf-8";
    }
    const utf8checker = "#KIF version=2.0 encoding=UTF-8".split("").map(s => s.charCodeAt(0));
    const len = utf8checker.length;
    if (data.length < len) {
        return "sjis";
    }
    for (let i = 0; i < len; i++) {
        if (data[i] !== utf8checker[i]) {
            return "sjis";
        }
    }
    return "sjis";
}
exports.detectEncoding = detectEncoding;
exports.recordParser = (() => {
    const ws = paco_1.desc(paco_1.charIn(" \t　"), "ws");
    const newline = paco_1.desc(paco_1.oneOf(paco_1.string("\r\n"), paco_1.char("\n")), "newline");
    const notNewline = paco_1.desc(paco_1.not(newline), "notNewline");
    const blank = paco_1.desc(paco_1.constant(paco_1.many(ws), null), "blank");
    const comment = paco_1.desc(paco_1.constant(paco_1.seq(paco_1.char("#"), paco_1.many(notNewline)), null), "comment");
    const ignore = paco_1.desc(paco_1.oneOf(blank, comment), "ignore");
    const ignoreLine = paco_1.desc(paco_1.constant(paco_1.seq(ignore, newline), null), "ignoreLine");
    const metaEntryKeyValueSep = paco_1.char("：");
    const metaEntryKey = paco_1.desc(paco_1.join(paco_1.many1(paco_1.not(paco_1.oneOf(metaEntryKeyValueSep, newline)))), "metaEntryKey");
    const metaEntryValue = paco_1.desc(paco_1.join(paco_1.many1(notNewline)), "metaEntryValue");
    const metaEntryLine = paco_1.desc(paco_1.transform(paco_1.seq(metaEntryKey, metaEntryKeyValueSep, metaEntryValue, newline), v => ({
        key: v[0],
        value: v[2],
    })), "metaEntryLine");
    const meta = paco_1.transform(paco_1.many(paco_1.oneOf(metaEntryLine, ignoreLine)), vs => {
        const r = {
            competition: "",
            location: "",
            startingSetup: { handicap: definitions_1.Handicap.NONE },
            players: { black: { name: "" }, white: { name: "" } },
        };
        // TODO
        const setters = {
            棋戦: s => (r.competition = s),
            手合割: s => (r.startingSetup.handicap = jp.parseHandicap(s) || undefined),
            先手: s => (r.players.black.name = s),
            後手: s => (r.players.white.name = s),
        };
        for (const v of vs) {
            if (v === null) {
                continue;
            }
            if (v.key in setters) {
                setters[v.key](v.value);
            }
        }
        return r;
    });
    const metaEnd = paco_1.desc(paco_1.seq(paco_1.string("手数"), paco_1.many1(paco_1.char("-")), paco_1.string("指手"), paco_1.many1(paco_1.char("-")), paco_1.string("消費時間"), paco_1.many(paco_1.char("-")), newline), "metaEnd");
    const moveNum = paco_1.desc(paco_1.transform(paco_1.join(paco_1.many1(paco_1.charRange("0", "9"))), s => Number(s)), "moveNum");
    const hanNumParsers = "123456789"
        .split("")
        .map((s, i) => paco_1.transform(paco_1.string(s), () => (i + 1)));
    const hanNum = paco_1.desc(paco_1.oneOf(...hanNumParsers), "hanNum");
    const zenNumParsers = "１２３４５６７８９"
        .split("")
        .map((s, i) => paco_1.transform(paco_1.string(s), () => (i + 1)));
    const zenNum = paco_1.desc(paco_1.oneOf(...zenNumParsers), "zenNum");
    const kanNumParsers = "一二三四五六七八九"
        .split("")
        .map((s, i) => paco_1.transform(paco_1.string(s), () => (i + 1)));
    const kanNum = paco_1.desc(paco_1.oneOf(...kanNumParsers), "kanNum");
    const sameDst = paco_1.desc(paco_1.constant(paco_1.seq(paco_1.string("同"), paco_1.optional(paco_1.string("　"), "")), "same"), "sameDst");
    const square = paco_1.desc(paco_1.seq(zenNum, kanNum), "square");
    const dst = paco_1.desc(paco_1.oneOf(square, sameDst), "dst");
    const pieceParsers = "歩香桂銀金角飛玉と杏圭全馬龍"
        .split("")
        .map(s => paco_1.transform(paco_1.string(s), v => jp.parsePiece(v)));
    const piece = paco_1.desc(paco_1.oneOf(...pieceParsers), "piece");
    const movementParsers = "打"
        .split("")
        .map(s => paco_1.transform(paco_1.string(s), v => jp.parseMovement(v)));
    const movement = paco_1.desc(paco_1.oneOf(...movementParsers), "movements");
    const src = paco_1.desc(paco_1.transform(paco_1.seq(paco_1.char("("), paco_1.seq(hanNum, hanNum), paco_1.char(")")), vs => vs[1]), "src");
    const eventBody = paco_1.desc(paco_1.oneOf(paco_1.transform(paco_1.seq(dst, piece, paco_1.many(movement), paco_1.optional(paco_1.string("成"), ""), paco_1.optional(src, null), paco_1.desc(paco_1.many(notNewline), "TODO")), vs => ({
        type: definitions_1.EventType.MOVE,
        color: definitions_1.Color.BLACK,
        dstSquare: (vs[0] !== "same" ? vs[0] : undefined),
        sameDstSquare: vs[0] === "same",
        srcPiece: vs[1],
        movements: vs[2],
        promote: vs[3].length > 0,
        srcSquare: vs[4],
    })), paco_1.constant(paco_1.string("投了"), {
        type: definitions_1.EventType.RESIGN,
        color: definitions_1.Color.BLACK,
    })), "eventBody");
    const event = paco_1.desc(paco_1.transform(paco_1.seq(moveNum, paco_1.many1(paco_1.charIn(" \t")), eventBody), vs => vs[2]), "event");
    const eventLines = paco_1.desc(paco_1.filterNull(paco_1.sepBy(paco_1.oneOf(event, ignore), newline)), "eventLine");
    const record = paco_1.desc(paco_1.transform(paco_1.seq(meta, paco_1.optional(metaEnd, ""), eventLines, paco_1.many(ignoreLine), paco_1.eof), vs => (Object.assign({}, vs[0], { events: vs[2] }))), "record");
    return record;
})();
function parseRecord(data, log) {
    let t;
    if (log) {
        t = new paco_1.BasicParserTracer({
            level: "verbose",
            log,
        });
    }
    const r = paco_1.execute(exports.recordParser, new paco_1.StringReader(data), t);
    if (r.error) {
        return r.error;
    }
    const record = r.value;
    let c = definitions_1.Color.BLACK;
    for (const e of record.events) {
        e.color = c;
        c = definitions_1.flipColor(c);
    }
    return r.value;
}
exports.parseRecord = parseRecord;
//# sourceMappingURL=kif.js.map