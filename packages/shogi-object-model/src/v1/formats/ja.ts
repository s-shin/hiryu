import {
  Color,
  Piece,
  Movement,
  Handicap,
  MoveEvent,
  Square,
  ResignEvent,
  Event,
  EventType,
} from "../definitions";

const zenNumTable = "０１２３４５６７８９".split("").reduce(
  (p, c, i) => ({
    zen2num: {
      ...p.zen2num,
      [c]: i,
    },
    num2zen: {
      ...p.num2zen,
      [i]: c,
    },
  }),
  { zen2num: {}, num2zen: {} },
) as any;

const kanNumTable = "〇一二三四五六七八九十".split("").reduce(
  (p, c, i) => ({
    kan2num: {
      ...p.kan2num,
      [c]: i,
    },
    num2kan: {
      ...p.num2kan,
      [i]: c,
    },
  }),
  { kan2num: {}, num2kan: {} },
) as any;

//! 0-99 → 〇〜九十九
export function num2kan(n: number): string | null {
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

//! 〇〜九 → 0-9
export function kan2num(s: string): number | null {
  if (s.length !== 1) {
    throw new Error("invalid argument");
  }
  const r = kanNumTable.kan2num[s];
  return r !== undefined ? r : null;
}

//! 12345 → １２３４５
export function num2zen(n: number): string | null {
  if (n < 0) {
    return null;
  }
  if (n === 0) {
    return "０";
  }
  const ss: string[] = [];
  for (let x = Math.floor(n); x !== 0; x = Math.floor(x * 0.1)) {
    ss.unshift(zenNumTable.num2zen[x % 10]);
  }
  return ss.join("");
}

//! ０〜９ → 0-9
export function zen2num(s: string): number | null {
  if (s.length !== 1) {
    return null;
  }
  const r = zenNumTable.zen2num[s];
  return r !== undefined ? r : null;
}

//---

export enum ColorFormatStyle {
  DEFAULT,
  TRIANGLE,
}

const colorStrs: {
  [style: string]: {
    [key: string]: string;
  };
} = {
  [ColorFormatStyle.DEFAULT]: {
    [Color.BLACK]: "☗",
    [Color.WHITE]: "☖",
  },
  [ColorFormatStyle.TRIANGLE]: {
    [Color.BLACK]: "▲",
    [Color.WHITE]: "△",
  },
};

export function stringifyColor(c: Color, opts = { style: ColorFormatStyle.DEFAULT }): string {
  return colorStrs[opts.style][c];
}

export function parseColor(s: string, opts = { style: ColorFormatStyle.DEFAULT }): Color | null {
  throw new Error("TODO");
}

//---

const enum PieceFormatStyle {
  LONG,
  ABBR,
}

const enum PieceFormatVariant {
  GYOKU,
}

const pieceStrs: {
  [style: number]: {
    [piece: string]: string | { [variant: string]: string };
  };
} = {
  [PieceFormatStyle.LONG]: {
    [Piece.FU]: "歩兵",
    [Piece.KY]: "香車",
    [Piece.KE]: "桂馬",
    [Piece.GI]: "銀将",
    [Piece.KI]: "金将",
    [Piece.KA]: "角行",
    [Piece.HI]: "飛車",
    [Piece.OU]: { default: "王将", [PieceFormatVariant.GYOKU]: "玉将" },
    [Piece.TO]: "と金",
    [Piece.NY]: "成香",
    [Piece.NK]: "成桂",
    [Piece.NG]: "成銀",
    [Piece.UM]: "龍馬",
    [Piece.RY]: "龍王",
  },
  [PieceFormatStyle.ABBR]: {
    [Piece.FU]: "歩",
    [Piece.KY]: "香",
    [Piece.KE]: "桂",
    [Piece.GI]: "銀",
    [Piece.KI]: "金",
    [Piece.KA]: "角",
    [Piece.HI]: "飛",
    [Piece.OU]: { default: "王", [PieceFormatVariant.GYOKU]: "玉" },
    [Piece.TO]: "と",
    [Piece.NY]: "杏",
    [Piece.NK]: "圭",
    [Piece.NG]: "全",
    [Piece.UM]: "馬",
    [Piece.RY]: "龍",
  },
  // [Style.EN]: {
  //   [Piece.FU]: "pawn",
  //   [Piece.KY]: "lance",
  //   [Piece.KE]: "knight",
  //   [Piece.GI]: "silver",
  //   [Piece.KI]: "gold",
  //   [Piece.KA]: "bishop",
  //   [Piece.HI]: "rook",
  //   [Piece.OU]: "king",
  //   [Piece.TO]: "promoted pawn",
  //   [Piece.NY]: "promoted lance",
  //   [Piece.NK]: "promoted knight",
  //   [Piece.NG]: "promoted silver",
  //   [Piece.UM]: "promoted bishop",
  //   [Piece.RY]: "promoted rook",
  // },
  // [Style.EN_ABBR]: {
  //   [Piece.FU]: "P",
  //   [Piece.KY]: "L",
  //   [Piece.KE]: "N",
  //   [Piece.GI]: "S",
  //   [Piece.KI]: "G",
  //   [Piece.KA]: "B",
  //   [Piece.HI]: "R",
  //   [Piece.OU]: "K",
  //   [Piece.TO]: "+P",
  //   [Piece.NY]: "+L",
  //   [Piece.NK]: "+N",
  //   [Piece.NG]: "+S",
  //   [Piece.UM]: "+B",
  //   [Piece.RY]: "+R",
  // },
};

export function stringifyPiece(
  p: Piece,
  opts = { style: PieceFormatStyle.ABBR, variants: [] },
): string {
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

export function parsePiece(s: string, opts = { style: PieceFormatStyle.ABBR }): Piece | null {
  // TODO: performance
  const strs = pieceStrs[opts.style];
  for (const p of Object.keys(strs)) {
    const t = strs[p];
    if (typeof t === "string") {
      if (t === s) {
        return p as Piece;
      }
      continue;
    }
    for (const variant of Object.keys(t)) {
      const tt = t[variant];
      if (tt === s) {
        return p as Piece;
      }
    }
  }
  return null;
}

//---

export function stringifySquare(sq: Square): string {
  return num2zen(sq[0])! + num2kan(sq[1])!;
}

export function parseSquare(s: string): Square | null {
  if (s.length != 2) {
    return null;
  }
  const x = zen2num(s[0]);
  const y = kan2num(s[1]);
  return x && y ? ([x, y] as Square) : null;
}

//---

const movementStrs: {
  [movement: string]: string;
} = {
  [Movement.DROPPED]: "打",
  [Movement.UPWARD]: "上",
  [Movement.DOWNWARD]: "引",
  [Movement.HORIZONTALLY]: "寄",
  [Movement.FROM_RIGHT]: "右",
  [Movement.FROM_LEFT]: "左",
  [Movement.VERTICALLY]: "直",
};

export function stringifyMovement(m: Movement) {
  return movementStrs[m];
}

export function parseMovement(s: string): Movement | null {
  // TODO: performance
  for (const m of Object.keys(movementStrs)) {
    if (s === movementStrs[m]) {
      return m as Movement;
    }
  }
  return null;
}

//---

const handicapStrs: {
  [handicap: string]: string;
} = {
  [Handicap.NONE]: "平手",
  [Handicap.KY]: "香落ち",
  [Handicap.RIGHT_KY]: "右香落ち",
  [Handicap.KA]: "角落ち",
  [Handicap.HI]: "飛車落ち",
  [Handicap.HI_KY]: "飛香落ち",
  [Handicap.TWO]: "二枚落ち",
  [Handicap.THREE]: "三枚落ち",
  [Handicap.FOUR]: "四枚落ち",
  [Handicap.FIVE]: "五枚落ち",
  [Handicap.SIX]: "六枚落ち",
  [Handicap.SEVEN]: "七枚落ち",
  [Handicap.EIGHT]: "八枚落ち",
  [Handicap.NINE]: "九枚落ち",
  [Handicap.TEN]: "十枚落ち",
};

export function stringifyHandicap(h: Handicap) {
  return handicapStrs[h];
}

export function parseHandicap(s: string) {
  // TODO: performance
  for (const h of Object.keys(handicapStrs)) {
    if (s === handicapStrs[h]) {
      return h as Handicap;
    }
  }
  return null;
}

//---

export function stringifyMoveEvent(e: MoveEvent, opts = { withColor: false }): string | null {
  const ss = [];
  if (opts.withColor) {
    ss.push(stringifyColor(e.color));
  }
  if (!e.dstSquare || !e.srcPiece || e.promote === undefined || e.sameDstSquare === undefined) {
    return null;
  }
  if (e.sameDstSquare) {
    ss.push("同　");
  } else {
    ss.push(stringifySquare(e.dstSquare));
  }
  ss.push(stringifyPiece(e.srcPiece));
  // TODO: movements
  if (e.promote) {
    ss.push("成");
  }
  return ss.join("");
}

export function stringifyResignEvent(e: ResignEvent, opts = { withColor: false }): string {
  const ss = [];
  if (opts.withColor) {
    ss.push(stringifyColor(e.color));
  }
  ss.push("投了");
  return ss.join("");
}

export function stringifyEvent(e: Event, opts = { withColor: false }): string | null {
  switch (e.type) {
    case EventType.MOVE: {
      return stringifyMoveEvent(e);
    }
    case EventType.RESIGN: {
      return stringifyResignEvent(e);
    }
  }
  return null;
}
