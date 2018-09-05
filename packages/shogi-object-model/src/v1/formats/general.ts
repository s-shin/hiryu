import { Color, Piece } from "../definitions";

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
}

export function stringifyColor(c: Color, opts = { style: Style.JA_ABBR }): string {
  return colorStrs[opts.style][c];
}

const pieceStrs: {
  [key: number]: {
    [key: string]: string,
  },
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
    [Piece.OU]: "王",
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

export function stringifyPiece(p: Piece, opts = { style: Style.JA_ABBR }): string {
  return pieceStrs[opts.style][p];
}
