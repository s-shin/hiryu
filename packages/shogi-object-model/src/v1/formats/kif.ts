import {
  join,
  many,
  many1,
  not,
  string,
  char,
  charIn,
  seq,
  transform,
  desc,
  constant,
  optional,
  oneOf,
  charRange,
  execute,
  StringReader,
  sepBy,
  eof,
  filterNull,
  BasicParserTracer,
} from "@hiryu/paco";
import {
  EventType,
  SquareNumber,
  Square,
  Color,
  Event,
  Handicap,
  Record,
  flipColor,
} from "../definitions";
import * as jp from "./ja";

// 棋譜ファイル KIF 形式: http://kakinoki.o.oo7.jp/kif_format.html

export function detectEncoding(data: Uint8Array): "utf-8" | "sjis" {
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

export const recordParser = (() => {
  const ws = desc(charIn(" \t　"), "ws");
  const newline = desc(oneOf(string("\r\n"), char("\n")), "newline");
  const notNewline = desc(not(newline), "notNewline");
  const blank = desc(constant(many(ws), null), "blank");
  const comment = desc(constant(seq(char("#"), many(notNewline)), null), "comment");
  const ignore = desc(oneOf(blank, comment), "ignore");
  const ignoreLine = desc(constant(seq(ignore, newline), null), "ignoreLine");

  const metaEntryKeyValueSep = char("：");
  const metaEntryKey = desc(join(many1(not(oneOf(metaEntryKeyValueSep, newline)))), "metaEntryKey");
  const metaEntryValue = desc(join(many1(notNewline)), "metaEntryValue");
  const metaEntryLine = desc(
    transform(seq(metaEntryKey, metaEntryKeyValueSep, metaEntryValue, newline), v => ({
      key: v[0],
      value: v[2],
    })),
    "metaEntryLine",
  );
  const meta = transform(many(oneOf(metaEntryLine, ignoreLine)), vs => {
    const r = {
      competition: "",
      location: "",
      startingSetup: { handicap: Handicap.NONE as Handicap | undefined },
      players: { black: { name: "" }, white: { name: "" } },
    };
    // TODO
    const setters: { [key: string]: (s: string) => void } = {
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

  const metaEnd = desc(
    seq(
      string("手数"),
      many1(char("-")),
      string("指手"),
      many1(char("-")),
      string("消費時間"),
      many(char("-")),
      newline,
    ),
    "metaEnd",
  );

  const moveNum = desc(transform(join(many1(charRange("0", "9"))), s => Number(s)), "moveNum");
  const hanNumParsers = "123456789"
    .split("")
    .map((s, i) => transform(string(s), () => (i + 1) as SquareNumber));
  const hanNum = desc(oneOf(...hanNumParsers), "hanNum");
  const zenNumParsers = "１２３４５６７８９"
    .split("")
    .map((s, i) => transform(string(s), () => (i + 1) as SquareNumber));
  const zenNum = desc(oneOf(...zenNumParsers), "zenNum");
  const kanNumParsers = "一二三四五六七八九"
    .split("")
    .map((s, i) => transform(string(s), () => (i + 1) as SquareNumber));
  const kanNum = desc(oneOf(...kanNumParsers), "kanNum");
  const sameDst = desc(
    constant<any, "same">(seq(string("同"), optional(string("　"), "")), "same"),
    "sameDst",
  );
  const square = desc(seq(zenNum, kanNum), "square");
  const dst = desc(oneOf(square, sameDst), "dst");
  const pieceParsers = "歩香桂銀金角飛玉と杏圭全馬龍"
    .split("")
    .map(s => transform(string(s), v => jp.parsePiece(v)!));
  const piece = desc(oneOf(...pieceParsers), "piece");
  const movementParsers = "打"
    .split("")
    .map(s => transform(string(s), v => jp.parseMovement(v)!));
  const movement = desc(oneOf(...movementParsers), "movements");
  const src = desc(transform(seq(char("("), seq(hanNum, hanNum), char(")")), vs => vs[1]), "src");
  const eventBody = desc(
    oneOf<Event>(
      transform(
        seq(
          dst,
          piece,
          many(movement),
          optional(string("成"), ""),
          optional(src, null),
          desc(many(notNewline), "TODO"),
        ),
        vs => ({
          type: EventType.MOVE as EventType.MOVE,
          color: Color.BLACK, // tmp
          dstSquare: (vs[0] !== "same" ? vs[0] : undefined) as Square | undefined,
          sameDstSquare: vs[0] === "same",
          srcPiece: vs[1],
          movements: vs[2],
          promote: vs[3].length > 0,
          srcSquare: vs[4],
        }),
      ),
      constant(string("投了"), {
        type: EventType.RESIGN as EventType.RESIGN,
        color: Color.BLACK, // tmp
      }),
    ),
    "eventBody",
  );
  const event = desc(
    transform(seq(moveNum, many1(charIn(" \t")), eventBody), vs => vs[2]),
    "event",
  );
  const eventLines = desc(filterNull(sepBy(oneOf(event, ignore), newline)), "eventLine");

  const record = desc(
    transform(
      seq(meta, optional(metaEnd, ""), eventLines, many(ignoreLine), eof),
      vs => ({ ...vs[0], events: vs[2] } as Record),
    ),
    "record",
  );

  return record;
})();

export function parseRecord(data: string, log?: (msg: string) => void) {
  let t: BasicParserTracer | undefined;
  if (log) {
    t = new BasicParserTracer({
      level: "verbose",
      log,
    });
  }
  const r = execute(recordParser, new StringReader(data), t);
  if (r.error) {
    return r.error;
  }
  const record = r.value!;
  let c = Color.BLACK;
  for (const e of record.events) {
    e.color = c;
    c = flipColor(c);
  }
  return r.value!;
}
