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
  filterNull,
  charRange,
  execute,
  StringReader,
  eof,
} from "@hiryu/paco";
import { EventType, SquareNumber, Square } from "../definitions";
import * as general from "./general";

export function detectEncoding(
  data: Uint8Array,
  opts = { TextDecoder: TextDecoder },
): "utf-8" | "sjis" {
  // check BOM of UTF-8.
  if (data.length >= 3 && data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
    return "utf-8";
  }
  const decoder = new opts.TextDecoder("utf-8");
  let head = decoder.decode(data.subarray(0, 64));
  const end = head.indexOf("\n");
  head = end > 0 ? head.slice(0, end) : head;
  const m = head.match(/^#KIF version=([^ ]+) encoding=([^ ]+)/);
  if (!m) {
    return "sjis";
  }
  if (m[2] === "UTF-8") {
    return "utf-8";
  }
  return "sjis";
}

export function decode(data: Uint8Array, opts = { TextDecoder: TextDecoder }) {
  const encoding = detectEncoding(data, opts);
  const decoder = new opts.TextDecoder(encoding);
  return decoder.decode(data);
}

export const recordParser = (() => {
  const ws = charIn(" \t　");
  const newline = oneOf(charIn("\r\n"), char("\n"));
  const notNewline = not(newline);
  const blankLine = seq(many(ws), newline);

  const metaEntryKeyValueSep = string("：");
  const metaEntryKey = join(many1(not(metaEntryKeyValueSep)));
  const metaEntryValue = join(many1(notNewline));
  const metaEntry = desc(
    transform(seq(metaEntryKey, metaEntryKeyValueSep, metaEntryValue, newline), v => ({
      key: v[0],
      value: v[2],
    })),
    "metaEntry",
  );
  const meta = filterNull(many(oneOf(metaEntry, constant(blankLine, null))));

  const metaEnd = seq(
    string("手数"),
    many1(char("-")),
    string("指手"),
    many1(char("-")),
    string("消費時間"),
    many(char("-")),
    newline,
  );

  const moveNum = transform(join(many1(charRange("0", "9"))), s => Number(s));
  const hanNumParsers = "123456789"
    .split("")
    .map((s, i) => transform(string(s), () => (i + 1) as SquareNumber));
  const hanNum = oneOf(...hanNumParsers);
  const zenNumParsers = "１２３４５６７８９"
    .split("")
    .map((s, i) => transform(string(s), () => (i + 1) as SquareNumber));
  const zenNum = oneOf(...zenNumParsers);
  const kanNumParsers = "一二三四五六七八九"
    .split("")
    .map((s, i) => transform(string(s), () => (i + 1) as SquareNumber));
  const kanNum = oneOf(...kanNumParsers);
  const sameDst = constant<any, "same">(seq(string("同"), optional(string("　"), "")), "same");
  const square = seq(zenNum, kanNum);
  const dst = oneOf(square, sameDst);
  const pieceParsers = "歩香桂銀金角飛玉と杏圭全馬龍"
    .split("")
    .map(s => transform(string(s), v => general.parsePiece(v)!));
  const piece = oneOf(...pieceParsers);
  const movementParsers = "打"
    .split("")
    .map(s => transform(string(s), v => general.parseMovement(v)!));
  const movement = oneOf(...movementParsers);
  const src = transform(seq(char("("), seq(hanNum, hanNum), char(")")), vs => vs[1]);
  const eventBody = oneOf(
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
        type: EventType.MOVE,
        dstSquare: (vs[0] !== "same" ? vs[0] : undefined) as Square | undefined,
        sameDst: vs[0] === "same",
        srcPiece: vs[1],
        movements: vs[2],
        promote: vs[3].length > 0,
        srcSquare: vs[4],
      }),
    ),
    constant(string("投了"), { type: EventType.RESIGN }),
  );
  const event = transform(seq(moveNum, many1(charIn(" \t")), eventBody), vs => vs[2]);
  const events = transform(seq(event, many(transform(seq(newline, event), vs => vs[1]))), vs => [
    vs[0],
    ...vs[1],
  ]);

  const record = seq(meta, metaEnd, events, many(blankLine), eof);

  return record;
})();

export function parseRecord(data: string) {
  const r = execute(recordParser, new StringReader(data));
  return r;
}
