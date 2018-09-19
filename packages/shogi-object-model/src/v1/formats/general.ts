import { Color, Piece, Movement, Handicap } from "../definitions";

const kansujiStrs = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

export function toKansuji(n: number) {
  const d2 = Math.floor(n * 0.1) % 10;
  const d1 = n % 10;
  return [
    d2 > 1 ? kansujiStrs[d2] : "",
    d2 > 0 ? kansujiStrs[10] : "",
    d1 > 0 ? kansujiStrs[d1] : "",
  ].join("");
}

export enum Style {
  JA,
  JA_ABBR,
  EN,
  EN_ABBR,
}

const colorStrs: {
  [key: number]: {
    [key: string]: string;
  };
} = {
  [Style.JA_ABBR]: {
    [Color.BLACK]: "☗",
    [Color.WHITE]: "☖",
  },
};

export function stringifyColor(c: Color, opts = { style: Style.JA_ABBR }): string {
  return colorStrs[opts.style][c];
}

const pieceStrs: {
  [style: number]: {
    [piece: string]: string | { [variant: string]: string };
  };
} = {
  [Style.JA]: {
    [Piece.FU]: "歩兵",
    [Piece.KY]: "香車",
    [Piece.KE]: "桂馬",
    [Piece.GI]: "銀将",
    [Piece.KI]: "金将",
    [Piece.KA]: "角行",
    [Piece.HI]: "飛車",
    [Piece.OU]: "王将",
    [Piece.TO]: "と金",
    [Piece.NY]: "成香",
    [Piece.NK]: "成桂",
    [Piece.NG]: "成銀",
    [Piece.UM]: "龍馬",
    [Piece.RY]: "龍王",
  },
  [Style.JA_ABBR]: {
    [Piece.FU]: "歩",
    [Piece.KY]: "香",
    [Piece.KE]: "桂",
    [Piece.GI]: "銀",
    [Piece.KI]: "金",
    [Piece.KA]: "角",
    [Piece.HI]: "飛",
    [Piece.OU]: { default: "王", gyoku: "玉" },
    [Piece.TO]: "と",
    [Piece.NY]: "杏",
    [Piece.NK]: "圭",
    [Piece.NG]: "全",
    [Piece.UM]: "馬",
    [Piece.RY]: "龍",
  },
  [Style.EN]: {
    [Piece.FU]: "pawn",
    [Piece.KY]: "lance",
    [Piece.KE]: "knight",
    [Piece.GI]: "silver",
    [Piece.KI]: "gold",
    [Piece.KA]: "bishop",
    [Piece.HI]: "rook",
    [Piece.OU]: "king",
    [Piece.TO]: "promoted pawn",
    [Piece.NY]: "promoted lance",
    [Piece.NK]: "promoted knight",
    [Piece.NG]: "promoted silver",
    [Piece.UM]: "promoted bishop",
    [Piece.RY]: "promoted rook",
  },
  [Style.EN_ABBR]: {
    [Piece.FU]: "P",
    [Piece.KY]: "L",
    [Piece.KE]: "N",
    [Piece.GI]: "S",
    [Piece.KI]: "G",
    [Piece.KA]: "B",
    [Piece.HI]: "R",
    [Piece.OU]: "K",
    [Piece.TO]: "+P",
    [Piece.NY]: "+L",
    [Piece.NK]: "+N",
    [Piece.NG]: "+S",
    [Piece.UM]: "+B",
    [Piece.RY]: "+R",
  },
};

export function stringifyPiece(p: Piece, opts = { style: Style.JA_ABBR, variants: [] }): string {
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

export function parsePiece(s: string, opts = { style: Style.JA_ABBR }): Piece | null {
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
  return null
}
