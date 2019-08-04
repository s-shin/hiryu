// CSA標準棋譜ファイル形式 v2.2
// http://www2.computer-shogi.org/protocol/record_v22.html
import {
  string,
  desc,
  charIn,
  oneOf,
  char,
  not,
  constant,
  many,
  seq,
  transform,
  join,
  many1,
  optional,
  BasicParserTracer,
  StringReader,
  execute,
} from "@hiryu/paco";
import {
  Color,
  Square,
  SquareNumber,
  Piece,
  isPiece,
  PIECES,
  MoveEvent,
  EventType,
} from "../definitions";

export function parseColor(s: string): Color | null {
  if (s === "+") {
    return Color.BLACK;
  }
  if (s === "-") {
    return Color.WHITE;
  }
  return null;
}

export function parseSquare(s: string): Square | null {
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
  return [x as SquareNumber, y as SquareNumber];
}

export function parsePiece(s: string): Piece | null {
  if (isPiece(s)) {
    return s;
  }
  return null;
}

export const recordParser = (() => {
  const newline = desc(oneOf(string("\r\n"), char("\n")), "newline");
  const notNewline = desc<string>(not(newline), "notNewline");

  const version = desc(string("V2.2"), "version");
  const versionLine = desc(transform(seq(version, newline), vs => vs[0]), "versionLine");

  const blackPlayerLine = desc(
    transform(seq(string("N+"), join(many(notNewline)), newline), vs => vs[1]),
    "blackPlayer",
  );
  const whitePlayerLine = desc(
    transform(seq(string("N-"), join(many(notNewline)), newline), vs => vs[1]),
    "whitePlayer",
  );
  const playerLines = desc(
    transform(seq(blackPlayerLine, whitePlayerLine), vs => {
      return {
        black: vs[0],
        white: vs[1],
      };
    }),
    "players",
  );

  const metaEntry = desc(seq(char("$"), many1(notNewline)), "metaEntry");
  const metaEntryLine = desc(transform(seq(metaEntry, newline), vs => vs[0]), "metaEntryLine");

  const setupLines = desc(many(seq(char("P"), many(notNewline), newline)), "setup");

  const color = desc(transform(charIn("+-"), v => parseColor(v)!), "firstTurn");
  const squareNumber = charIn("1234567890");
  const square = desc(
    transform(join(seq(squareNumber, squareNumber)), vs => parseSquare(vs)),
    "square",
  );
  const piece = desc(oneOf(...PIECES.map(p => constant(string(p), p))), "piece");

  const firstTurnLine = desc(transform(seq(color, newline), vs => vs[0]), "firstTurn");

  const moveLine = desc<MoveEvent>(
    transform(seq(color, square, square, piece), vs => {
      return {
        type: EventType.MOVE,
        color: vs[0],
        srcSquare: vs[1],
        dstSquare: vs[2] || undefined,
        dstPiece: vs[3],
      };
    }),
    "moveLine",
  );

  const timeLine = desc(seq(char("T"), many(notNewline), newline), "timeLine");

  const moveEvent = seq(moveLine, optional(timeLine, null));

  const specialLine = desc(
    transform(seq(char("%"), oneOf(...["TORYO"].map(s => string(s))), newline), vs => null),
    "specialLine",
  );

  const record = desc(
    transform(
      seq(
        optional(versionLine, "TODO"),
        optional(playerLines, null),
        many(metaEntryLine),
        setupLines,
        firstTurnLine,
        many(oneOf(moveEvent, specialLine)),
      ),
      vs => ({ vs }),
    ),
    "record",
  );

  return record;
})();

export function preprocessRecordData(data: string): string {
  return data.replace(/($|\n)('[^\n]*|\s*)\r?\n/, "");
}

export function parseRecord(data: string, log?: (msg: string) => void) {
  let t: BasicParserTracer | undefined;
  if (log) {
    t = new BasicParserTracer({
      level: "verbose",
      log,
    });
  }
  const r = execute(recordParser, new StringReader(preprocessRecordData(data)), t);
  if (r.error) {
    return r.error;
  }
  const record = r.value!;
  // TODO
  return record;
}
