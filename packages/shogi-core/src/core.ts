import * as Immutable from "immutable";
import { DateTime, Duration, Interval } from "luxon";

//------------------------------------------------------------------------------
// String interfaces
//------------------------------------------------------------------------------

export interface USIStringifyable {
  toUSIString(): string;
}

export interface CSAStringifyable {
  toCSAString(): string;
}

export interface JapaneseNotationStringifyable {
  toJapaneseNotationString(): string;
}

export interface AllStringifiable extends
  USIStringifyable,
  CSAStringifyable,
  JapaneseNotationStringifyable {}

//------------------------------------------------------------------------------
// Piece
//------------------------------------------------------------------------------

export enum PieceId {
  FU, KY, KE, GI, KI, HI, KA, OU,
  TO, NY, NK, NG, RY, UM,
}

export const HEADS_PIECE_IDS = Immutable.List([
  PieceId.FU, PieceId.KY, PieceId.KE, PieceId.GI, PieceId.KI, PieceId.HI, PieceId.KA, PieceId.OU,
]);

export const TAILS_PIECE_IDS = Immutable.List([
  PieceId.TO, PieceId.NY, PieceId.NK, PieceId.NG, PieceId.RY, PieceId.UM,
]);

// TODO: refactor these string maps.
export const PIECE_ID_TO_CSA_STRING = Immutable.Map<PieceId, string>([
  [PieceId.FU, "FU"],
  [PieceId.KY, "KY"],
  [PieceId.KE, "KE"],
  [PieceId.GI, "GI"],
  [PieceId.KI, "KI"],
  [PieceId.HI, "HI"],
  [PieceId.KA, "KA"],
  [PieceId.OU, "OU"],
  [PieceId.TO, "TO"],
  [PieceId.NY, "NY"],
  [PieceId.NK, "NK"],
  [PieceId.NG, "NG"],
  [PieceId.RY, "RY"],
  [PieceId.UM, "UM"],
]);

export const PIECE_ID_TO_USI_STRING = Immutable.Map<PieceId, string>([
  [PieceId.FU, "P"],
  [PieceId.KY, "L"],
  [PieceId.KE, "N"],
  [PieceId.GI, "S"],
  [PieceId.KI, "G"],
  [PieceId.HI, "R"],
  [PieceId.KA, "B"],
  [PieceId.OU, "K"],
  [PieceId.TO, "+P"],
  [PieceId.NY, "+L"],
  [PieceId.NK, "+N"],
  [PieceId.NG, "+S"],
  [PieceId.RY, "+R"],
  [PieceId.UM, "+B"],
]);

export const PIECE_ID_TO_JAPANESE_NOTATION_STRING = Immutable.Map<PieceId, string>([
  [PieceId.FU, "歩"],
  [PieceId.KY, "香"],
  [PieceId.KE, "桂"],
  [PieceId.GI, "銀"],
  [PieceId.KI, "金"],
  [PieceId.HI, "飛"],
  [PieceId.KA, "角"],
  [PieceId.TO, "と"],
  [PieceId.NY, "成香"],
  [PieceId.NK, "成桂"],
  [PieceId.NG, "成銀"],
  [PieceId.RY, "龍"],
  [PieceId.UM, "馬"],
  [PieceId.OU, "王"],
]);

export const CSA_STRING_TO_PIECE_ID = PIECE_ID_TO_CSA_STRING.flip();
export const USI_STRING_TO_PIECE_ID = PIECE_ID_TO_USI_STRING.flip();
export const JAPANESE_NOTATION_STRING_TO_PIECE_ID = PIECE_ID_TO_JAPANESE_NOTATION_STRING.flip();

export const PROMOTE_MAP = Immutable.Map([
  [PieceId.FU, PieceId.TO],
  [PieceId.KY, PieceId.NY],
  [PieceId.KE, PieceId.NK],
  [PieceId.GI, PieceId.NG],
  [PieceId.HI, PieceId.RY],
  [PieceId.KA, PieceId.UM],
]);

export const DEMOTE_MAP = PROMOTE_MAP.flip();

export class Piece implements Immutable.ValueObject, AllStringifiable {
  static readonly FU = new Piece(PieceId.FU);
  static readonly KY = new Piece(PieceId.KY);
  static readonly KE = new Piece(PieceId.KE);
  static readonly GI = new Piece(PieceId.GI);
  static readonly KI = new Piece(PieceId.KI);
  static readonly HI = new Piece(PieceId.HI);
  static readonly KA = new Piece(PieceId.KA);
  static readonly OU = new Piece(PieceId.OU);
  static readonly TO = new Piece(PieceId.TO);
  static readonly NY = new Piece(PieceId.NY);
  static readonly NK = new Piece(PieceId.NK);
  static readonly NG = new Piece(PieceId.NG);
  static readonly RY = new Piece(PieceId.RY);
  static readonly UM = new Piece(PieceId.UM);

  constructor(readonly id: PieceId) {}

  isFU() { return this.id === PieceId.FU; }
  isKY() { return this.id === PieceId.KY; }
  isKE() { return this.id === PieceId.KE; }
  isGI() { return this.id === PieceId.GI; }
  isKI() { return this.id === PieceId.KI; }
  isHI() { return this.id === PieceId.HI; }
  isKA() { return this.id === PieceId.KA; }
  isOU() { return this.id === PieceId.OU; }
  isTO() { return this.id === PieceId.TO; }
  isNY() { return this.id === PieceId.NY; }
  isNK() { return this.id === PieceId.NK; }
  isNG() { return this.id === PieceId.NG; }
  isRY() { return this.id === PieceId.RY; }
  isUM() { return this.id === PieceId.UM; }

  canPromote() { return PROMOTE_MAP.has(this.id); }
  isHeads() { return HEADS_PIECE_IDS.includes(this.id); }
  isTails() { return TAILS_PIECE_IDS.includes(this.id); }

  flip(alt = null) {
    let id = PROMOTE_MAP.get(this.id, null);
    if (id !== null) {
      return new Piece(id);
    }
    id = DEMOTE_MAP.get(this.id, null);
    if (id !== null) {
      return new Piece(id);
    }
    return alt;
  }

  heads() { return this.isHeads() ? this : this.flip()!; }
  tails(alt = null) { return this.isTails() ? this : this.flip(alt); }

  toCSAString() {
    return PIECE_ID_TO_CSA_STRING.get(this.id, "");
  }
  static fromCSAString(s: string) {
    const id = CSA_STRING_TO_PIECE_ID.get(s, null);
    if (id === null) {
      return null;
    }
    return new Piece(id);
  }

  toUSIString() {
    return PIECE_ID_TO_USI_STRING.get(this.id, "");
  }
  static fromUSIString(s: string) {
    const id = USI_STRING_TO_PIECE_ID.get(s.toUpperCase(), null);
    if (!id) {
      return null;
    }
    return new Piece(id);
  }

  toJapaneseNotationString() {
    return PIECE_ID_TO_JAPANESE_NOTATION_STRING.get(this.id, "");
  }

  toString() { return this.toCSAString(); }

  // implementations of ValueObject
  equals(other: any) { return other instanceof Piece && this.id === other.id; }
  hashCode() { return this.id; }
}

//------------------------------------------------------------------------------
// Color
//------------------------------------------------------------------------------

export enum ColorId { BLACK, WHITE }

export class Color implements Immutable.ValueObject, AllStringifiable {
  static readonly BLACK = new Color(ColorId.BLACK);
  static readonly WHITE = new Color(ColorId.WHITE);

  private constructor(public id: ColorId) {}

  isBlack() { return this.id === ColorId.BLACK; }
  isWhite() { return this.id === ColorId.WHITE; }

  flip() {
    switch (this.id) {
      case ColorId.BLACK: return Color.WHITE;
      case ColorId.WHITE: return Color.BLACK;
    }
    throw new Error("invalid color id");
  }

  toCSAString() {
    switch (this.id) {
      case ColorId.BLACK: return "+";
      case ColorId.WHITE: return "-";
    }
    throw new Error("invalid color id");
  }

  toUSIString() {
    switch (this.id) {
      case ColorId.BLACK: return "b";
      case ColorId.WHITE: return "w";
    }
    throw new Error("invalid color id");
  }

  toJapaneseNotationString(marks = ["▲", "△"]) {
    return marks[this.id];
  }

  toString() { return ColorId[this.id]; }

  // implementations of ValueObject
  equals(other: any) { return other instanceof Color && this.id === other.id; }
  hashCode() { return this.id; }
}

//------------------------------------------------------------------------------
// Position
//------------------------------------------------------------------------------

export type PositionLike = Position | { x: number, y: number } | [number, number];

const han2zen = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
const han2kan = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

export class Position extends Immutable.Record({ x: 0, y: 0 }) implements AllStringifiable {
  static readonly MIN_INDEX = 1;
  static readonly MAX_INDEX = 9;
  static readonly INDICES = Immutable.List([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  static readonly REV_INDICES = Immutable.List([9, 8, 7, 6, 5, 4, 3, 2, 1]);

  static from(pos: PositionLike): Position;
  static from(x: number, y: number): Position;
  static from(a1: any, a2?: any) {
    if (a1 instanceof Position) {
      return a1;
    }
    if (Array.isArray(a1)) {
      return new Position({ x: a1[0], y: a1[1] });
    }
    if (a2 !== undefined) {
      return new Position({ x: a1, y: a2 });
    }
    return new Position(a1 as { x: number, y: number });
  }

  move(dx = 0, dy = 0) {
    return new Position({ x: this.x + dx, y: this.y + dy });
  }

  isInsideBoard() {
    return Position.MIN_INDEX <= this.x && this.x <= Position.MAX_INDEX
      && Position.MIN_INDEX <= this.y && this.y <= Position.MAX_INDEX;
  }

  toCSAString() {
    return `${this.x}${this.y}`;
  }

  toUSIString() {
    const y = String.fromCharCode("a".charCodeAt(0) + this.y - 1);
    return `${this.x}${y}`;
  }

  toJapaneseNotationString() {
    return `${han2zen[this.x]}${han2kan[this.y]}`;
  }

  flip() {
    return new Position({
      x: Position.MAX_INDEX - this.x + 1,
      y: Position.MAX_INDEX - this.y + 1,
    });
  }

  toString() { return this.toCSAString(); }
}

//------------------------------------------------------------------------------
// Handicap
//------------------------------------------------------------------------------

export enum Handicap {
  NONE, KY, HI, KA, HI_KA, TWO, THREE, FOUR, FIVE, SIX, EIGHT, TEN,
}

//------------------------------------------------------------------------------
// Board
//------------------------------------------------------------------------------

export class ColorPiece extends Immutable.Record({
  color: Color.BLACK,
  piece: Piece.FU,
}) implements USIStringifyable, CSAStringifyable {
  static readonly _ = new ColorPiece();

  static from(color: Color, piece: Piece): ColorPiece;
  static from(cp: { color: Color, piece: Piece }): ColorPiece;
  static from(a1: any, piece?: Piece) {
    if (a1 instanceof Color) {
      return new ColorPiece({ color: a1, piece: piece! });
    }
    return new ColorPiece(a1 as { color: Color, piece: Piece });
  }

  static black(piece: Piece) { return ColorPiece.from(Color.BLACK, piece); }
  static white(piece: Piece) { return ColorPiece.from(Color.WHITE, piece); }

  toCSAString() {
    return `${this.color.toCSAString()}${this.piece.toCSAString()}`;
  }

  toUSIString() {
    const s = this.piece.toUSIString();
    return this.color.isBlack() ? s : s.toLowerCase();
  }

  toString() { return this.toCSAString(); }
}

const HIRATE_BOARD_MAP = (() => {
  const mapArr: Array<[Position, ColorPiece]> = [];
  for (const color of [Color.BLACK, Color.WHITE]) {
    const add = (posLike: PositionLike, piece: Piece) => {
      let pos = Position.from(posLike);
      pos = color.isBlack() ? pos : pos.flip();
      mapArr.push([pos, ColorPiece.from(color, piece)]);
    };
    for (const pp of [
      [[1, 9], Piece.KY],
      [[2, 9], Piece.KE],
      [[3, 9], Piece.GI],
      [[4, 9], Piece.KI],
    ] as Array<[[number, number], Piece]>) {
      add(pp[0], pp[1]);
      add(Position.from(10 - pp[0][0], pp[0][1]), pp[1]);
    }
    add([5, 9], Piece.OU);
    add([2, 8], Piece.HI);
    add([8, 8], Piece.KA);
    for (const x of Position.INDICES) {
      add([x, 7], Piece.FU);
    }
  }
  return Immutable.Map<Position, ColorPiece>(mapArr);
})();

function deleteFromHirate(...positions: PositionLike[]) {
  return HIRATE_BOARD_MAP.withMutations(mut => {
    for (const p of positions) {
      mut.delete(Position.from(p));
    }
  });
}

const BOARD_MAP_PRESETS = Immutable.Map<Handicap, Immutable.Map<Position, ColorPiece>>([
  [Handicap.NONE,  HIRATE_BOARD_MAP],
  [Handicap.KY, deleteFromHirate([1, 1])],
  [Handicap.KA, deleteFromHirate([2, 2])],
  [Handicap.HI, deleteFromHirate([8, 2])],
  [Handicap.HI_KA, deleteFromHirate([2, 2], [8, 2])],
  // TODO
]);

export class Board implements Immutable.ValueObject, USIStringifyable, CSAStringifyable {
  static readonly WIDTH = 9;
  static readonly HEIGHT = 9;

  static preset(h: Handicap) {
    return new Board(BOARD_MAP_PRESETS.get(h));
  }

  constructor(
    private _map = Immutable.Map<Position, ColorPiece>(),
  ) {}

  get map() { return this._map; }

  set(pos: PositionLike, sp: ColorPiece) { return new Board(this._map.set(Position.from(pos), sp)); }
  get(pos: PositionLike) { return this._map.get(Position.from(pos), null); }
  has(pos: PositionLike) { return this.get(Position.from(pos)) !== null; }
  delete(pos: PositionLike) { return new Board(this._map.delete(Position.from(pos))); }

  *[Symbol.iterator](): IterableIterator<[Position, ColorPiece | null]> {
    for (let y = Position.MIN_INDEX; y <= Position.MAX_INDEX; y++) {
      for (let x = Position.MIN_INDEX; x <= Position.MAX_INDEX; x++) {
        const pos = new Position({ x, y });
        yield [pos, this.get(pos)];
      }
    }
  }

  toCSAString() {
    const rows = [];
    for (const y of Position.INDICES) {
      const row = [`P${y}`];
      for (const x of Position.REV_INDICES) {
        const cp = this.get([x, y]);
        row.push(cp ? cp.toCSAString() : " * ");
      }
      rows.push(row.join(""));
    }
    return rows.join("\n");
  }

  toUSIString() {
    const rows = [];
    for (const y of Position.INDICES) {
      const row = [];
      let space = 0;
      for (const x of Position.REV_INDICES) {
        const cp = this.get([x, y]);
        if (cp === null) {
          space++;
        } else {
          if (space > 0) {
            row.push(`${space}`);
            space = 0;
          }
          row.push(cp.toUSIString());
        }
      }
      if (space > 0) {
        row.push(`${space}`);
      }
      rows.push(row.join(""));
    }
    return rows.join("/");
  }

  // implementations of ValueObject
  equals(other: any) { return other instanceof Board && Immutable.is(this.map, other.map); }
  hashCode() { return this.map.hashCode(); }
}

//------------------------------------------------------------------------------
// Hand
//------------------------------------------------------------------------------

export class Hand implements Immutable.ValueObject {
  constructor(
    private _map = Immutable.Map<Piece, number>(),
  ) {}

  get map() { return this._map; }

  set(p: Piece, n: number) { return new Hand(this._map.set(p, n)); }
  get(p: Piece) { return this.map.get(p, 0); }
  has(p: Piece) { return this.get(p) > 0; }
  inc(p: Piece, dn = 1) { return this.set(p, this.get(p) + dn); }
  dec(p: Piece, dn = 1) { return this.inc(p, -dn); }

  // implementations of ValueObject
  equals(other: any) { return other instanceof Hand && Immutable.is(this.map, other.map); }
  hashCode() { return this.map.hashCode(); }

  toCSAString(color: Color) {
    const buf = [];
    for (const pieceId of PROMOTE_MAP.keys()) {
      const p = new Piece(pieceId);
      const n = this.get(p);
      for (let i = 0; i < n; i++) {
        buf.push(`00${p.toCSAString()}`);
      }
    }
    return `P${color.toCSAString()}${buf.join("")}`;
  }

  toUSIString(color: Color) {
    const buf = [];
    for (const pieceId of PROMOTE_MAP.keys()) {
      const p = new Piece(pieceId);
      const n = this.get(p);
      if (n > 0) {
        const cp = new ColorPiece({ color, piece: p });
        buf.push(`${n === 1 ? "" : n}${cp.toUSIString()}`);
      }
    }
    return buf.join("");
  }
}

//------------------------------------------------------------------------------
// State
//------------------------------------------------------------------------------

export class State extends Immutable.Record({
  board: new Board(),
  handBlack: new Hand(),
  handWhite: new Hand(),
  nextTurn: Color.BLACK,
  moveNum: 0,
}) implements USIStringifyable, CSAStringifyable {
  static preset(h: Handicap) {
    return new State({
      board: Board.preset(h),
      nextTurn: h === Handicap.NONE ? Color.BLACK : Color.WHITE,
    });
  }

  getHand(color: Color) {
    return color.isBlack() ? this.handBlack : this.handWhite;
  }

  toCSAString() {
    return [
      "'Board",
      this.board.toCSAString(),
      "'Hands",
      this.handBlack.toCSAString(Color.BLACK),
      this.handWhite.toCSAString(Color.WHITE),
      "'Next Turn",
      this.nextTurn.toCSAString(),
    ].join("\n");
  }

  toUSIString() {
    const hands = this.handBlack.toUSIString(Color.BLACK) + this.handWhite.toUSIString(Color.WHITE);
    return [
      "sfen",
      this.board.toUSIString(),
      this.nextTurn.toUSIString(),
      hands.length > 0 ? hands : "-",
      this.moveNum + 1,
    ].join(" ");
  }

  toSFEN() { return this.toUSIString(); }
}

//------------------------------------------------------------------------------
// Events
//------------------------------------------------------------------------------

export type Time = DateTime | Interval | Duration;

export const DEFAULT_COMMON_EVENT_PROPS = {
  time: null as Time | null,
};

//---

export class StartEvent extends Immutable.Record({
  ...DEFAULT_COMMON_EVENT_PROPS,
}) implements JapaneseNotationStringifyable {
  toJapaneseNotationString() {
    return "開始局面";
  }
}

//---

/**
 * Standard (in this lib, CSA style) move event.
 */
export class CSAMoveEvent extends Immutable.Record({
  ...DEFAULT_COMMON_EVENT_PROPS,
  color: Color.BLACK,
  from: null as Position | null,
  to: new Position({ x: 0, y: 0 }),
  piece: Piece.FU,
}) implements CSAStringifyable {
  toCSAString() {
    return [
      this.color.toCSAString(),
      this.from ? this.from.toCSAString() : "00",
      this.to.toCSAString(),
      this.piece.toCSAString(),
    ].join("");
  }
}

//---

/**
 * USI style move event.
 */
export class USIMoveEvent extends Immutable.Record({
  ...DEFAULT_COMMON_EVENT_PROPS,
  src: new Position() as Position | Piece,
  to: new Position({ x: 0, y: 0 }),
  promote: false,
}) implements USIStringifyable {
  toUSIString() {
    return [
      this.src instanceof Piece ? this.src.toUSIString() + "*" : "",
      this.src instanceof Position ? this.src.toUSIString() : "",
      this.to.toUSIString(),
    ].join("");
  }
}

//---

export enum MovementNotation {
  DROPPED,
  DOWNWARD,
  HORIZONTALLY,
  UPWARD,
  FROM_RIGHT,
  FROM_LEFT,
  VERTICALLY,
  UPWARD_FROM_RIGHT,
  DOWNWARD_FROM_RIGHT,
  UPWARD_FROM_LEFT,
  DOWNWARD_FROM_LEFT,
}

export const MOVEMENT_NOTATION_TO_JAPANESE_NOTATION_STRING = Immutable.Map<MovementNotation, string>([
  [MovementNotation.DROPPED, "打"],
  [MovementNotation.DOWNWARD, "引"],
  [MovementNotation.HORIZONTALLY, "寄"],
  [MovementNotation.UPWARD, "上"],
  [MovementNotation.FROM_RIGHT, "右"],
  [MovementNotation.FROM_LEFT, "左"],
  [MovementNotation.VERTICALLY, "直"],
  [MovementNotation.UPWARD_FROM_RIGHT, "右上"],
  [MovementNotation.DOWNWARD_FROM_RIGHT, "右下"],
  [MovementNotation.UPWARD_FROM_LEFT, "左上"],
  [MovementNotation.DOWNWARD_FROM_LEFT, "左下"],
]);

export enum PromotionNotation {
  PROMOTE,
  NOT_PROMOTE,
}

export const PROMOTION_NOTATION_TO_JAPANESE_NOTATION_STRING = Immutable.Map<PromotionNotation, string>([
  [PromotionNotation.PROMOTE, "成"],
  [PromotionNotation.NOT_PROMOTE, "不成"],
]);

/**
 * Japanese notation style move event.
 *
 * @see https://www.shogi.or.jp/faq/kihuhyouki.html
 */
export class JapaneseNotationMoveEvent extends Immutable.Record({
  ...DEFAULT_COMMON_EVENT_PROPS,
  color: Color.BLACK,
  to: new Position() as Position | "same",
  srcPiece: Piece.FU,
  movement: null as MovementNotation | null,
  promote: null as PromotionNotation | null,
}) implements JapaneseNotationStringifyable {
  toJapaneseNotationString() {
    return [
      this.color.toJapaneseNotationString(),
      this.to === "same" ? "同" : this.to.toJapaneseNotationString(),
      this.srcPiece.toJapaneseNotationString(),
      this.movement ? MOVEMENT_NOTATION_TO_JAPANESE_NOTATION_STRING.get(this.movement)! : "",
      this.promote ? PROMOTION_NOTATION_TO_JAPANESE_NOTATION_STRING.get(this.promote)! : "",
    ].join("");
  }
}

//---

export class ResignEvent extends Immutable.Record({
  ...DEFAULT_COMMON_EVENT_PROPS,
  color: Color.BLACK,
}) implements JapaneseNotationStringifyable {
  toJapaneseNotationString() {
    return "投了";
  }
}

//---

export type MoveEvent = CSAMoveEvent | USIMoveEvent | JapaneseNotationMoveEvent;

export type Event = StartEvent | MoveEvent | ResignEvent;

export function isMoveEvent(e: Event): e is MoveEvent {
  return e instanceof CSAMoveEvent
    || e instanceof USIMoveEvent
    || e instanceof JapaneseNotationMoveEvent;
}

//------------------------------------------------------------------------------
// Record
//------------------------------------------------------------------------------

const MAINSTREAM_FORK = -1;
const EMPTY_EVENT_INDEX = -1;

export class RecordEventPointer extends Immutable.Record({
  forkIndex: MAINSTREAM_FORK,
  eventIndex: EMPTY_EVENT_INDEX,
}) {
  isMainstream() {
    return this.forkIndex === MAINSTREAM_FORK;
  }

  isEmptyEventIndex() {
    return this.eventIndex === EMPTY_EVENT_INDEX;
  }

  next() {
    return new RecordEventPointer({
      forkIndex: this.forkIndex,
      eventIndex: this.eventIndex + 1,
    });
  }

  prev() {
    return new RecordEventPointer({
      forkIndex: this.forkIndex,
      eventIndex: this.eventIndex - 1,
    });
  }
}

export class RecordFork extends Immutable.Record({
  forkedFrom: new RecordEventPointer(),
  events: Immutable.List<Event>(),
}) {
  static readonly MAINSTREAM = MAINSTREAM_FORK;

  isForkedFromMainstream() {
    return this.forkedFrom.forkIndex === RecordFork.MAINSTREAM;
  }
}

export class Record extends Immutable.Record({
  initialState: State.preset(Handicap.NONE),
  events: Immutable.List<Event>(),
  forks: Immutable.List<RecordFork>(),
}) {
  getEvent(p: RecordEventPointer): Event | Error {
    if (p.isMainstream()) {
      const event = this.events.get(p.eventIndex);
      if (!event) {
        return new Error("event not found");
      }
      return event;
    }
    const fork = this.forks.get(p.forkIndex);
    if (!fork) {
      return new Error("fork not found");
    }
    const event = fork.events.get(p.eventIndex);
    if (!event) {
      return new Error("event not found");
    }
    return event;
  }

  gatherForkPoints(forkIndex: number): RecordEventPointer[] | Error {
    let fork = this.forks.get(forkIndex);
    if (!fork) {
      return new Error("fork not found");
    }
    const r: RecordEventPointer[] = [];
    while (true) {
      r.unshift(fork.forkedFrom);
      if (fork.forkedFrom.isMainstream) {
        break;
      }
      fork = this.forks.get(fork.forkedFrom.forkIndex);
      if (!fork) {
        return new Error("fork not found");
      }
    }
    return r;
  }

  *iterateRev(forkIndex: number): IterableIterator<[RecordEventPointer, Event]> {
    let p = new RecordEventPointer({ forkIndex, eventIndex: this.events.size - 1 });
    let fork: RecordFork | undefined;
    if (forkIndex !== RecordFork.MAINSTREAM) {
      fork = this.forks.get(forkIndex);
      if (!fork) {
        throw new Error("fork not found");
      }
      p = new RecordEventPointer({ forkIndex, eventIndex: fork.events.size - 1 });
    }
    while (!p.isEmptyEventIndex()) {
      const event = this.getEvent(p);
      if (event instanceof Error) {
        throw new Error("event not found");
      }
      yield [p, event];
      if (p.eventIndex === 0) {
        if (p.isMainstream()) {
          break;
        }
        if (!fork) {
          throw new Error("fork not found");
        }
        p = fork.forkedFrom;
        fork = this.forks.get(p.forkIndex);
        if (!fork) {
          throw new Error("fork not found");
        }
      } else {
        p = p.prev();
      }
    }
  }

  getEventEntries(forkIndex: number) {
    const r: Array<[RecordEventPointer, Event]> = [];
    for (const entry of this.iterateRev(forkIndex)) {
      r.unshift(entry);
    }
    return r;
  }

  getEventPointers(forkIndex: number) {
    const r: RecordEventPointer[] = [];
    for (const entry of this.iterateRev(forkIndex)) {
      r.unshift(entry[0]);
    }
    return r;
  }
}

//------------------------------------------------------------------------------
// Game
//------------------------------------------------------------------------------

export interface CommonGameProps {
  readonly state: State;
}

export type GameReducer<Game extends CommonGameProps> =
  (game: Game, event: Event) => Game;

//------------------------------------------------------------------------------
// GameInfo
//------------------------------------------------------------------------------

// export const DEFAULT_COMMON_GAME_INFO_PROPS = {
//   players: {
//     black: { name: "(no name)", rank: "", note: "" },
//     white: { name: "(no name)", rank: "", note: "" },
//   },
//   handicap: Handicap.NONE,
// };
