import {
  Board,
  Color,
  ColorPiece,
  Hand,
  Handicap,
  Hands,
  Piece,
  Square,
  State,
  MIN_SQUARE_NUMBER,
  MAX_SQUARE_NUMBER,
  SQUARE_NUMBERS,
  getEmptyBoard,
  getEmptyHands,
  getBoardSquare,
  colorToKeyOfHands,
  pieceToKeyOfHand,
} from "../definitions";
import { flipObject } from "../../util";

const PIECE_TO_USI_STRING: {
  [piece: string]: string;
} = {
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
};

const USI_STRING_TO_PIECE: {
  [s: string]: Piece;
} = flipObject(PIECE_TO_USI_STRING);

export function stringifyPiece(piece: Piece): string {
  return PIECE_TO_USI_STRING[piece];
}

export function parsePiece(s: string, asColor = Color.BLACK): Piece | null {
  const piece = USI_STRING_TO_PIECE[asColor === Color.BLACK ? s : s.toUpperCase()];
  if (!piece) {
    return null;
  }
  return piece;
}

export function stringifyColor(color: Color): string {
  return color === Color.BLACK ? "b" : "w";
}

export function parseColor(s: string): Color | null {
  const color = s === "b" ? Color.BLACK : s === "w" ? Color.WHITE : null;
  if (!color) {
    return null;
  }
  return color;
}

export function stringifyColorPiece(cp: ColorPiece): string {
  const s = stringifyPiece(cp.piece);
  return cp.color === Color.BLACK ? s : s.toLowerCase();
}

export function parseColorPiece(s: string): ColorPiece | null {
  {
    const piece = parsePiece(s);
    if (piece) {
      return { color: Color.BLACK, piece };
    }
  }
  {
    const piece = parsePiece(s, Color.WHITE);
    if (piece) {
      return { color: Color.WHITE, piece };
    }
  }
  return null;
}

export function stringifySquare(pos: Square): string {
  return pos[0] + String.fromCharCode("a".charCodeAt(0) + (pos[1] - 1));
}

export function parseSquare(s: string): Square | null {
  if (s.length !== 2) {
    return null;
  }
  const x = Number(s[0]);
  const y = s[1].charCodeAt(0) - "a".charCodeAt(0) + 1;
  if (
    MIN_SQUARE_NUMBER <= x &&
    x <= MAX_SQUARE_NUMBER &&
    MIN_SQUARE_NUMBER <= y &&
    y <= MAX_SQUARE_NUMBER
  ) {
    return [x, y] as Square;
  }
  return null;
}

export function stringifyBoard(board: Board): string {
  const rows = [];
  for (const y of SQUARE_NUMBERS) {
    const row = [];
    let space = 0;
    for (let x = MAX_SQUARE_NUMBER; x >= MIN_SQUARE_NUMBER; x--) {
      const cp = getBoardSquare(board, [x, y]);
      if (cp === null) {
        space++;
      } else {
        if (space > 0) {
          row.push(`${space}`);
          space = 0;
        }
        row.push(stringifyColorPiece(cp));
      }
    }
    if (space > 0) {
      row.push(`${space}`);
    }
    rows.push(row.join(""));
  }
  return rows.join("/");
}

export function parseBoard(s: string): Board | null {
  const board = getEmptyBoard();
  let sqrIdx = 0;
  let i = 0;
  while (i < s.length) {
    let cpStr = s[i++];
    if (cpStr === "/") {
      if (sqrIdx > 0 && sqrIdx % 9 !== 0) {
        return null;
      }
      continue;
    }
    {
      const spaces = Number(cpStr);
      if (!isNaN(spaces)) {
        if (MIN_SQUARE_NUMBER <= spaces && spaces <= MAX_SQUARE_NUMBER) {
          sqrIdx += spaces;
          continue;
        } else {
          return null;
        }
      }
    }
    if (cpStr === "+") {
      i++;
      if (i >= s.length) {
        return null;
      }
      cpStr += s[i];
    }
    board[sqrIdx++] = parseColorPiece(cpStr);
  }
  if (sqrIdx !== 81) {
    return null;
  }
  return board;
}

export function stringifyHand(hand: Hand, color = Color.BLACK): string {
  const ss = [];
  for (const piece of [Piece.FU, Piece.KY, Piece.KE, Piece.GI, Piece.KI, Piece.KA, Piece.HI]) {
    const n = hand[piece as keyof Hand];
    if (n === 0) {
      continue;
    }
    const s = stringifyColorPiece({ color, piece });
    ss.push(n >= 2 ? n : "");
    ss.push(s);
  }
  return ss.join("");
}

export function stringifyHands(hands: Hands): string {
  const s = stringifyHand(hands.black, Color.BLACK) + stringifyHand(hands.white, Color.WHITE);
  return s.length > 0 ? s : "-";
}

export function parseHands(s: string): Hands | null {
  const hands = getEmptyHands();
  if (s === "-") {
    return hands;
  }
  for (let i = 0; i < s.length; i++) {
    let cpStr = s[i];
    let n = Number(cpStr);
    if (!isNaN(n)) {
      if (++i >= s.length) {
        return null;
      }
      cpStr = s[i + 1];
    } else {
      n = 1;
    }
    const cp = parseColorPiece(cpStr);
    if (!cp) {
      return null;
    }
    hands[colorToKeyOfHands(cp.color)][pieceToKeyOfHand(cp.piece)] = n;
  }
  return hands;
}

export function stringifyState(state: State) {
  return [
    stringifyBoard(state.board),
    stringifyColor(state.nextTurn),
    stringifyHands(state.hands),
  ].join(" ");
}

export function parseState(s: string): State | null {
  const ss = s.split(" ");
  if (ss.length !== 3) {
    return null;
  }
  const board = parseBoard(ss[0]);
  const color = parseColor(ss[1]);
  const hands = parseHands(ss[2]);
  if (!board || !color || !hands) {
    return null;
  }
  return { board, hands, nextTurn: color };
}

export interface SFEN {
  state: State;
  nextMoveNum: number;
}

export function stringifySFEN(sfen: SFEN) {
  return [stringifyState(sfen.state), sfen.nextMoveNum].join(" ");
}

export function parseSFEN(s: string): SFEN | null {
  const ss = s.split(" ");
  if (ss.length !== 4) {
    return null;
  }
  const state = parseState(ss.slice(0, 3).join(" "));
  const nextMoveNum = Number(ss[3]);
  if (isNaN(nextMoveNum)) {
    return null;
  }
  if (!state) {
    return null;
  }
  return { state, nextMoveNum };
}

const SFEN_STRS = {
  [Handicap.NONE]: "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
  [Handicap.KY]: "lnsgkgsn1/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.RIGHT_KY]: "1nsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.KA]: "lnsgkgsnl/1r7/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.HI]: "lnsgkgsnl/7b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.HI_KY]: "lnsgkgsn1/7b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.TWO]: "lnsgkgsnl/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.THREE]: "lnsgkgsn1/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.FOUR]: "1nsgkgsn1/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.FIVE]: "2sgkgsn1/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.SIX]: "2sgkgs2/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.SEVEN]: "3gkgs2/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.EIGHT]: "3gkg3/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.NINE]: "4kg3/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
  [Handicap.TEN]: "4k4/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1",
};

export function getSFENString(h: Handicap): string {
  return SFEN_STRS[h];
}

export function getSFEN(h: Handicap): SFEN {
  return parseSFEN(getSFENString(h))!;
}

export interface Move {
  srcSquare?: Square | null;
  srcPiece?: Piece;
  dstSquare: Square;
  promote?: boolean;
}

export function parseMove(s: string): Move | null {
  const len = s.length;
  if (len < 4 || 5 < len) {
    throw new Error("parseMove: invalid Move string");
  }

  const src = s.slice(0, 2);
  const srcSquare = parseSquare(src) || undefined;
  let srcPiece;
  if (!srcSquare) {
    // try to parse src as drop
    const piece = parsePiece(src[0]);
    if (!piece) {
      return null;
    }
    srcPiece = piece;
  }

  const dst = s.slice(2, 4);
  const dstSquare = parseSquare(dst);
  if (!dstSquare) {
    return null;
  }

  let promote;
  if (len === 5) {
    if (s[4] !== "+") {
      throw new Error("parseMove: invalid Move string");
    }
    promote = true;
  }

  return { srcSquare, srcPiece, dstSquare, promote };
}

export function stringifyMove(move: Move): string {
  const buf = [];
  if (move.srcSquare) {
    buf.push(stringifySquare(move.srcSquare));
  } else if (move.srcPiece) {
    buf.push(stringifyPiece(move.srcPiece));
    buf.push("*");
  } else {
    throw new Error("stringifyMove: invalid Move object");
  }
  buf.push(stringifySquare(move.dstSquare));
  if (move.promote) {
    buf.push("+");
  }
  return buf.join("");
}
