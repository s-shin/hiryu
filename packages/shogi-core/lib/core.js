"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const Immutable = __importStar(require("immutable"));
//------------------------------------------------------------------------------
// Piece
//------------------------------------------------------------------------------
var PieceId;
(function (PieceId) {
    PieceId[PieceId["FU"] = 0] = "FU";
    PieceId[PieceId["KY"] = 1] = "KY";
    PieceId[PieceId["KE"] = 2] = "KE";
    PieceId[PieceId["GI"] = 3] = "GI";
    PieceId[PieceId["KI"] = 4] = "KI";
    PieceId[PieceId["HI"] = 5] = "HI";
    PieceId[PieceId["KA"] = 6] = "KA";
    PieceId[PieceId["OU"] = 7] = "OU";
    PieceId[PieceId["TO"] = 8] = "TO";
    PieceId[PieceId["NY"] = 9] = "NY";
    PieceId[PieceId["NK"] = 10] = "NK";
    PieceId[PieceId["NG"] = 11] = "NG";
    PieceId[PieceId["RY"] = 12] = "RY";
    PieceId[PieceId["UM"] = 13] = "UM";
})(PieceId = exports.PieceId || (exports.PieceId = {}));
exports.HEADS_PIECE_IDS = Immutable.List([
    PieceId.FU, PieceId.KY, PieceId.KE, PieceId.GI, PieceId.KI, PieceId.HI, PieceId.KA, PieceId.OU,
]);
exports.TAILS_PIECE_IDS = Immutable.List([
    PieceId.TO, PieceId.NY, PieceId.NK, PieceId.NG, PieceId.RY, PieceId.UM,
]);
// TODO: refactor these string maps.
exports.PIECE_ID_TO_CSA_STRING = Immutable.Map([
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
exports.PIECE_ID_TO_USI_STRING = Immutable.Map([
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
exports.PIECE_ID_TO_JAPANESE_NOTATION_STRING = Immutable.Map([
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
exports.CSA_STRING_TO_PIECE_ID = exports.PIECE_ID_TO_CSA_STRING.flip();
exports.USI_STRING_TO_PIECE_ID = exports.PIECE_ID_TO_USI_STRING.flip();
exports.JAPANESE_NOTATION_STRING_TO_PIECE_ID = exports.PIECE_ID_TO_JAPANESE_NOTATION_STRING.flip();
exports.PROMOTE_MAP = Immutable.Map([
    [PieceId.FU, PieceId.TO],
    [PieceId.KY, PieceId.NY],
    [PieceId.KE, PieceId.NK],
    [PieceId.GI, PieceId.NG],
    [PieceId.HI, PieceId.RY],
    [PieceId.KA, PieceId.UM],
]);
exports.DEMOTE_MAP = exports.PROMOTE_MAP.flip();
class Piece {
    constructor(id) {
        this.id = id;
    }
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
    canPromote() { return exports.PROMOTE_MAP.has(this.id); }
    isHeads() { return exports.HEADS_PIECE_IDS.includes(this.id); }
    isTails() { return exports.TAILS_PIECE_IDS.includes(this.id); }
    flip(alt = null) {
        let id = exports.PROMOTE_MAP.get(this.id, null);
        if (id !== null) {
            return new Piece(id);
        }
        id = exports.DEMOTE_MAP.get(this.id, null);
        if (id !== null) {
            return new Piece(id);
        }
        return alt;
    }
    heads() { return this.isHeads() ? this : this.flip(); }
    tails(alt = null) { return this.isTails() ? this : this.flip(alt); }
    toCSAString() {
        return exports.PIECE_ID_TO_CSA_STRING.get(this.id, "");
    }
    static fromCSAString(s) {
        const id = exports.CSA_STRING_TO_PIECE_ID.get(s, null);
        if (id === null) {
            return null;
        }
        return new Piece(id);
    }
    toUSIString() {
        return exports.PIECE_ID_TO_USI_STRING.get(this.id, "");
    }
    static fromUSIString(s) {
        const id = exports.USI_STRING_TO_PIECE_ID.get(s.toUpperCase(), null);
        if (!id) {
            return null;
        }
        return new Piece(id);
    }
    toJapaneseNotationString() {
        return exports.PIECE_ID_TO_JAPANESE_NOTATION_STRING.get(this.id, "");
    }
    toString() { return this.toCSAString(); }
    // implementations of ValueObject
    equals(other) { return other instanceof Piece && this.id === other.id; }
    hashCode() { return this.id; }
}
Piece.FU = new Piece(PieceId.FU);
Piece.KY = new Piece(PieceId.KY);
Piece.KE = new Piece(PieceId.KE);
Piece.GI = new Piece(PieceId.GI);
Piece.KI = new Piece(PieceId.KI);
Piece.HI = new Piece(PieceId.HI);
Piece.KA = new Piece(PieceId.KA);
Piece.OU = new Piece(PieceId.OU);
Piece.TO = new Piece(PieceId.TO);
Piece.NY = new Piece(PieceId.NY);
Piece.NK = new Piece(PieceId.NK);
Piece.NG = new Piece(PieceId.NG);
Piece.RY = new Piece(PieceId.RY);
Piece.UM = new Piece(PieceId.UM);
exports.Piece = Piece;
//------------------------------------------------------------------------------
// Color
//------------------------------------------------------------------------------
var ColorId;
(function (ColorId) {
    ColorId[ColorId["BLACK"] = 0] = "BLACK";
    ColorId[ColorId["WHITE"] = 1] = "WHITE";
})(ColorId = exports.ColorId || (exports.ColorId = {}));
class Color {
    constructor(id) {
        this.id = id;
    }
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
    equals(other) { return other instanceof Color && this.id === other.id; }
    hashCode() { return this.id; }
}
Color.BLACK = new Color(ColorId.BLACK);
Color.WHITE = new Color(ColorId.WHITE);
exports.Color = Color;
const han2zen = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
const han2kan = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
class Position extends Immutable.Record({ x: 0, y: 0 }) {
    static from(a1, a2) {
        if (a1 instanceof Position) {
            return a1;
        }
        if (Array.isArray(a1)) {
            return new Position({ x: a1[0], y: a1[1] });
        }
        if (a2 !== undefined) {
            return new Position({ x: a1, y: a2 });
        }
        return new Position(a1);
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
Position.MIN_INDEX = 1;
Position.MAX_INDEX = 9;
Position.INDICES = Immutable.List([1, 2, 3, 4, 5, 6, 7, 8, 9]);
Position.REV_INDICES = Immutable.List([9, 8, 7, 6, 5, 4, 3, 2, 1]);
exports.Position = Position;
//------------------------------------------------------------------------------
// Handicap
//------------------------------------------------------------------------------
var Handicap;
(function (Handicap) {
    Handicap[Handicap["NONE"] = 0] = "NONE";
    Handicap[Handicap["KY"] = 1] = "KY";
    Handicap[Handicap["HI"] = 2] = "HI";
    Handicap[Handicap["KA"] = 3] = "KA";
    Handicap[Handicap["HI_KA"] = 4] = "HI_KA";
    Handicap[Handicap["TWO"] = 5] = "TWO";
    Handicap[Handicap["THREE"] = 6] = "THREE";
    Handicap[Handicap["FOUR"] = 7] = "FOUR";
    Handicap[Handicap["FIVE"] = 8] = "FIVE";
    Handicap[Handicap["SIX"] = 9] = "SIX";
    Handicap[Handicap["EIGHT"] = 10] = "EIGHT";
    Handicap[Handicap["TEN"] = 11] = "TEN";
})(Handicap = exports.Handicap || (exports.Handicap = {}));
//------------------------------------------------------------------------------
// Board
//------------------------------------------------------------------------------
class ColorPiece extends Immutable.Record({
    color: Color.BLACK,
    piece: Piece.FU,
}) {
    static from(a1, piece) {
        if (a1 instanceof Color) {
            return new ColorPiece({ color: a1, piece: piece });
        }
        return new ColorPiece(a1);
    }
    static black(piece) { return ColorPiece.from(Color.BLACK, piece); }
    static white(piece) { return ColorPiece.from(Color.WHITE, piece); }
    toCSAString() {
        return `${this.color.toCSAString()}${this.piece.toCSAString()}`;
    }
    toUSIString() {
        const s = this.piece.toUSIString();
        return this.color.isBlack() ? s : s.toLowerCase();
    }
    toString() { return this.toCSAString(); }
}
ColorPiece._ = new ColorPiece();
exports.ColorPiece = ColorPiece;
const HIRATE_BOARD_MAP = (() => {
    const mapArr = [];
    for (const color of [Color.BLACK, Color.WHITE]) {
        const add = (posLike, piece) => {
            let pos = Position.from(posLike);
            pos = color.isBlack() ? pos : pos.flip();
            mapArr.push([pos, ColorPiece.from(color, piece)]);
        };
        for (const pp of [
            [[1, 9], Piece.KY],
            [[2, 9], Piece.KE],
            [[3, 9], Piece.GI],
            [[4, 9], Piece.KI],
        ]) {
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
    return Immutable.Map(mapArr);
})();
function deleteFromHirate(...positions) {
    return HIRATE_BOARD_MAP.withMutations(mut => {
        for (const p of positions) {
            mut.delete(Position.from(p));
        }
    });
}
const BOARD_MAP_PRESETS = Immutable.Map([
    [Handicap.NONE, HIRATE_BOARD_MAP],
    [Handicap.KY, deleteFromHirate([1, 1])],
    [Handicap.KA, deleteFromHirate([2, 2])],
    [Handicap.HI, deleteFromHirate([8, 2])],
    [Handicap.HI_KA, deleteFromHirate([2, 2], [8, 2])],
]);
class Board {
    constructor(_map = Immutable.Map()) {
        this._map = _map;
    }
    static preset(h) {
        return new Board(BOARD_MAP_PRESETS.get(h));
    }
    get map() { return this._map; }
    set(pos, sp) { return new Board(this._map.set(Position.from(pos), sp)); }
    get(pos) { return this._map.get(Position.from(pos), null); }
    has(pos) { return this.get(Position.from(pos)) !== null; }
    delete(pos) { return new Board(this._map.delete(Position.from(pos))); }
    *[Symbol.iterator]() {
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
                }
                else {
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
    equals(other) { return other instanceof Board && Immutable.is(this.map, other.map); }
    hashCode() { return this.map.hashCode(); }
}
Board.WIDTH = 9;
Board.HEIGHT = 9;
exports.Board = Board;
//------------------------------------------------------------------------------
// Hand
//------------------------------------------------------------------------------
class Hand {
    constructor(_map = Immutable.Map()) {
        this._map = _map;
    }
    get map() { return this._map; }
    set(p, n) { return new Hand(this._map.set(p, n)); }
    get(p) { return this.map.get(p, 0); }
    has(p) { return this.get(p) > 0; }
    inc(p, dn = 1) { return this.set(p, this.get(p) + dn); }
    dec(p, dn = 1) { return this.inc(p, -dn); }
    // implementations of ValueObject
    equals(other) { return other instanceof Hand && Immutable.is(this.map, other.map); }
    hashCode() { return this.map.hashCode(); }
    toCSAString(color) {
        const buf = [];
        for (const pieceId of exports.PROMOTE_MAP.keys()) {
            const p = new Piece(pieceId);
            const n = this.get(p);
            for (let i = 0; i < n; i++) {
                buf.push(`00${p.toCSAString()}`);
            }
        }
        return `P${color.toCSAString()}${buf.join("")}`;
    }
    toUSIString(color) {
        const buf = [];
        for (const pieceId of exports.PROMOTE_MAP.keys()) {
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
exports.Hand = Hand;
//------------------------------------------------------------------------------
// State
//------------------------------------------------------------------------------
class State extends Immutable.Record({
    board: new Board(),
    handBlack: new Hand(),
    handWhite: new Hand(),
    nextTurn: Color.BLACK,
    moveNum: 0,
}) {
    static preset(h) {
        return new State({
            board: Board.preset(h),
            nextTurn: h === Handicap.NONE ? Color.BLACK : Color.WHITE,
        });
    }
    getHand(color) {
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
exports.State = State;
exports.DEFAULT_COMMON_EVENT_PROPS = {
    time: null,
};
//---
class StartEvent extends Immutable.Record(Object.assign({}, exports.DEFAULT_COMMON_EVENT_PROPS)) {
    toJapaneseNotationString() {
        return "開始局面";
    }
}
exports.StartEvent = StartEvent;
//---
/**
 * Standard (in this lib, CSA style) move event.
 */
class CSAMoveEvent extends Immutable.Record(Object.assign({}, exports.DEFAULT_COMMON_EVENT_PROPS, { color: Color.BLACK, from: null, to: new Position({ x: 0, y: 0 }), piece: Piece.FU })) {
    toCSAString() {
        return [
            this.color.toCSAString(),
            this.from ? this.from.toCSAString() : "00",
            this.to.toCSAString(),
            this.piece.toCSAString(),
        ].join("");
    }
}
exports.CSAMoveEvent = CSAMoveEvent;
//---
/**
 * USI style move event.
 */
class USIMoveEvent extends Immutable.Record(Object.assign({}, exports.DEFAULT_COMMON_EVENT_PROPS, { src: new Position(), to: new Position({ x: 0, y: 0 }), promote: false })) {
    toUSIString() {
        return [
            this.src instanceof Piece ? this.src.toUSIString() + "*" : "",
            this.src instanceof Position ? this.src.toUSIString() : "",
            this.to.toUSIString(),
        ].join("");
    }
}
exports.USIMoveEvent = USIMoveEvent;
//---
var MovementNotation;
(function (MovementNotation) {
    MovementNotation[MovementNotation["DROPPED"] = 0] = "DROPPED";
    MovementNotation[MovementNotation["DOWNWARD"] = 1] = "DOWNWARD";
    MovementNotation[MovementNotation["HORIZONTALLY"] = 2] = "HORIZONTALLY";
    MovementNotation[MovementNotation["UPWARD"] = 3] = "UPWARD";
    MovementNotation[MovementNotation["FROM_RIGHT"] = 4] = "FROM_RIGHT";
    MovementNotation[MovementNotation["FROM_LEFT"] = 5] = "FROM_LEFT";
    MovementNotation[MovementNotation["VERTICALLY"] = 6] = "VERTICALLY";
    MovementNotation[MovementNotation["UPWARD_FROM_RIGHT"] = 7] = "UPWARD_FROM_RIGHT";
    MovementNotation[MovementNotation["DOWNWARD_FROM_RIGHT"] = 8] = "DOWNWARD_FROM_RIGHT";
    MovementNotation[MovementNotation["UPWARD_FROM_LEFT"] = 9] = "UPWARD_FROM_LEFT";
    MovementNotation[MovementNotation["DOWNWARD_FROM_LEFT"] = 10] = "DOWNWARD_FROM_LEFT";
})(MovementNotation = exports.MovementNotation || (exports.MovementNotation = {}));
exports.MOVEMENT_NOTATION_TO_JAPANESE_NOTATION_STRING = Immutable.Map([
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
var PromotionNotation;
(function (PromotionNotation) {
    PromotionNotation[PromotionNotation["PROMOTE"] = 0] = "PROMOTE";
    PromotionNotation[PromotionNotation["NOT_PROMOTE"] = 1] = "NOT_PROMOTE";
})(PromotionNotation = exports.PromotionNotation || (exports.PromotionNotation = {}));
exports.PROMOTION_NOTATION_TO_JAPANESE_NOTATION_STRING = Immutable.Map([
    [PromotionNotation.PROMOTE, "成"],
    [PromotionNotation.NOT_PROMOTE, "不成"],
]);
/**
 * Japanese notation style move event.
 *
 * @see https://www.shogi.or.jp/faq/kihuhyouki.html
 */
class JapaneseNotationMoveEvent extends Immutable.Record(Object.assign({}, exports.DEFAULT_COMMON_EVENT_PROPS, { color: Color.BLACK, to: new Position(), srcPiece: Piece.FU, movement: null, promote: null })) {
    toJapaneseNotationString() {
        return [
            this.color.toJapaneseNotationString(),
            this.to === "same" ? "同" : this.to.toJapaneseNotationString(),
            this.srcPiece.toJapaneseNotationString(),
            this.movement ? exports.MOVEMENT_NOTATION_TO_JAPANESE_NOTATION_STRING.get(this.movement) : "",
            this.promote ? exports.PROMOTION_NOTATION_TO_JAPANESE_NOTATION_STRING.get(this.promote) : "",
        ].join("");
    }
}
exports.JapaneseNotationMoveEvent = JapaneseNotationMoveEvent;
//---
class ResignEvent extends Immutable.Record(Object.assign({}, exports.DEFAULT_COMMON_EVENT_PROPS, { color: Color.BLACK })) {
    toJapaneseNotationString() {
        return "投了";
    }
}
exports.ResignEvent = ResignEvent;
function isMoveEvent(e) {
    return e instanceof CSAMoveEvent
        || e instanceof USIMoveEvent
        || e instanceof JapaneseNotationMoveEvent;
}
exports.isMoveEvent = isMoveEvent;
//------------------------------------------------------------------------------
// Record
//------------------------------------------------------------------------------
const MAINSTREAM_FORK = -1;
const EMPTY_EVENT_INDEX = -1;
class RecordEventPointer extends Immutable.Record({
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
exports.RecordEventPointer = RecordEventPointer;
class RecordFork extends Immutable.Record({
    forkedFrom: new RecordEventPointer(),
    events: Immutable.List(),
}) {
    isForkedFromMainstream() {
        return this.forkedFrom.forkIndex === RecordFork.MAINSTREAM;
    }
}
RecordFork.MAINSTREAM = MAINSTREAM_FORK;
exports.RecordFork = RecordFork;
class Record extends Immutable.Record({
    initialState: State.preset(Handicap.NONE),
    events: Immutable.List(),
    forks: Immutable.List(),
}) {
    getEvent(p) {
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
    gatherForkPoints(forkIndex) {
        let fork = this.forks.get(forkIndex);
        if (!fork) {
            return new Error("fork not found");
        }
        const r = [];
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
    *iterateRev(forkIndex) {
        let p = new RecordEventPointer({ forkIndex, eventIndex: this.events.size - 1 });
        let fork;
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
            }
            else {
                p = p.prev();
            }
        }
    }
    getEventEntries(forkIndex) {
        const r = [];
        for (const entry of this.iterateRev(forkIndex)) {
            r.unshift(entry);
        }
        return r;
    }
    getEventPointers(forkIndex) {
        const r = [];
        for (const entry of this.iterateRev(forkIndex)) {
            r.unshift(entry[0]);
        }
        return r;
    }
}
exports.Record = Record;
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
//# sourceMappingURL=core.js.map