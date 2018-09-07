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
const core = __importStar(require("./core"));
const luxon_1 = require("luxon");
exports.DROPPABLE_PIECE_IDS = Immutable.List([
    core.PieceId.FU,
    core.PieceId.KY,
    core.PieceId.KE,
    core.PieceId.GI,
    core.PieceId.KI,
    core.PieceId.HI,
    core.PieceId.KA,
]);
var Violation;
(function (Violation) {
    Violation[Violation["UNACCEPTABLE_EVENT_FOR_STATE"] = 0] = "UNACCEPTABLE_EVENT_FOR_STATE";
    Violation[Violation["INVALID_TURN"] = 1] = "INVALID_TURN";
    Violation[Violation["NOT_DROPPABLE_PIECE"] = 2] = "NOT_DROPPABLE_PIECE";
    Violation[Violation["NOT_DROPPABLE_POSITION"] = 3] = "NOT_DROPPABLE_POSITION";
    Violation[Violation["NOT_MOVABLE_POSITION"] = 4] = "NOT_MOVABLE_POSITION";
    Violation[Violation["NO_SPECIFIED_PIECE_IN_HAND"] = 5] = "NO_SPECIFIED_PIECE_IN_HAND";
    Violation[Violation["NOT_MOVABLE_PIECE"] = 6] = "NOT_MOVABLE_PIECE";
    Violation[Violation["CANNOT_PUT_PIECE_ONTO_BOARD"] = 7] = "CANNOT_PUT_PIECE_ONTO_BOARD";
    Violation[Violation["NO_SPECIFIED_PIECE_ON_BOARD"] = 8] = "NO_SPECIFIED_PIECE_ON_BOARD";
    Violation[Violation["NIFU"] = 9] = "NIFU";
    Violation[Violation["UCHIFUZUME"] = 10] = "UCHIFUZUME";
})(Violation = exports.Violation || (exports.Violation = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["NOT_STARTED"] = 0] = "NOT_STARTED";
    GameStatus[GameStatus["STARTED"] = 1] = "STARTED";
    GameStatus[GameStatus["END"] = 2] = "END";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
class Context extends Immutable.Record({
    // criticalViolations: Set<Violation>([
    //   Violation.INVALID_TURN,
    //   Violation.NOT_DROPPABLE_PIECE,
    //   Violation.NOT_DROPPABLE_POSITION,
    //   Violation.NOT_MOVABLE_POSITION,
    //   Violation.NO_SPECIFIED_PIECE_IN_HAND,
    //   Violation.CANNOT_PUT_PIECE_ONTO_BOARD,
    //   Violation.NO_SPECIFIED_PIECE_ON_BOARD,
    //   Violation.NIFU,
    //   Violation.UCHIFUZUME,
    // ]),
    status: GameStatus.NOT_STARTED,
    stateHistory: Array(),
    lastViolation: null,
}) {
}
exports.Context = Context;
class Game extends Immutable.Record({
    state: new core.State(),
    ctx: new Context(),
}) {
    static preset(h) {
        return new Game({ state: core.State.preset(h) });
    }
}
exports.Game = Game;
function isNeverMovable(pos, color, piece) {
    const bpos = color.isBlack() ? pos : pos.flip();
    return ((piece.isFU() || piece.isKY()) && bpos.y <= 1) || ((piece.isKE()) && bpos.y <= 2);
}
exports.isNeverMovable = isNeverMovable;
function isInPromortableArea(pos, color) {
    return (color.isBlack() ? pos : pos.flip()).y <= 3;
}
exports.isInPromortableArea = isInPromortableArea;
class MoveCandidate extends Immutable.Record({
    to: new core.Position(),
    piece: core.Piece.FU,
    isDrop: false,
}) {
}
exports.MoveCandidate = MoveCandidate;
function getMoveCandidates(board, pos) {
    const cp = board.get(pos);
    if (cp === null) {
        return Immutable.Set();
    }
    const sign = cp.color.isBlack() ? -1 : 1;
    const r = [];
    const add = (dx, dy) => {
        const dst = pos.move(dx * sign, dy * sign);
        if (!dst.isInsideBoard()) {
            return false;
        }
        const dstCP = board.get(dst);
        if (dstCP && dstCP.color.equals(cp.color)) {
            return false;
        }
        let canContinue = false;
        if (!isNeverMovable(dst, cp.color, cp.piece)) {
            r.push(new MoveCandidate({ to: dst, piece: cp.piece }));
            canContinue = true;
        }
        if (cp.piece.canPromote() && (isInPromortableArea(pos, cp.color) || isInPromortableArea(dst, cp.color))) {
            r.push(new MoveCandidate({ to: dst, piece: cp.piece.flip() }));
            canContinue = true;
        }
        if (dstCP && dstCP.color.equals(cp.color.flip())) {
            // Stop traverse when a piece captured.
            return canContinue = false;
        }
        return canContinue;
    };
    switch (cp.piece.id) {
        case core.PieceId.FU: {
            add(0, 1);
            break;
        }
        case core.PieceId.KY: {
            for (const i of core.Position.INDICES) {
                if (!add(0, i)) {
                    break;
                }
            }
            break;
        }
        case core.PieceId.KE: {
            for (const dx of [1, -1]) {
                add(dx, 2);
            }
            break;
        }
        case core.PieceId.GI: {
            for (const dp of [[-1, 1], [0, 1], [1, 1], [-1, -1], [1, -1]]) {
                add(dp[0], dp[1]);
            }
            break;
        }
        case core.PieceId.KI:
        case core.PieceId.TO:
        case core.PieceId.NY:
        case core.PieceId.NK:
        case core.PieceId.NG: {
            for (const dp of [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [0, -1]]) {
                add(dp[0], dp[1]);
            }
            break;
        }
        case core.PieceId.KA:
        case core.PieceId.UM: {
            for (const dp of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                for (const i of core.Position.INDICES) {
                    if (!add(dp[0] * i, dp[1] * i)) {
                        break;
                    }
                }
            }
            if (cp.piece.id === core.PieceId.UM) {
                for (const dp of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
                    add(dp[0], dp[1]);
                }
            }
            break;
        }
        case core.PieceId.HI:
        case core.PieceId.RY: {
            for (const dp of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
                for (const i of core.Position.INDICES) {
                    if (!add(dp[0] * i, dp[1] * i)) {
                        break;
                    }
                }
            }
            if (cp.piece.id === core.PieceId.RY) {
                for (const dp of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                    add(dp[0], dp[1]);
                }
            }
            break;
        }
        case core.PieceId.OU: {
            for (const dp of [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]]) {
                add(dp[0], dp[1]);
            }
            break;
        }
    }
    return Immutable.Set(r);
}
exports.getMoveCandidates = getMoveCandidates;
function getDropCandidates(board, color, piece) {
    const r = [];
    for (const [to, cp] of board) {
        if (cp === null) {
            if (!isNeverMovable(to, color, piece)) {
                r.push(new MoveCandidate({ to, piece, isDrop: true }));
            }
        }
    }
    return Immutable.Set(r);
}
exports.getDropCandidates = getDropCandidates;
exports.reducer = (game, event) => {
    const violate = (violation) => game.setIn(["ctx", "lastViolation"], violation);
    switch (game.ctx.status) {
        case GameStatus.NOT_STARTED: {
            if (event instanceof core.StartEvent) {
                return game.updateIn(["ctx", "status"], (v) => GameStatus.STARTED);
            }
            return violate(Violation.UNACCEPTABLE_EVENT_FOR_STATE);
        }
        case GameStatus.STARTED: {
            if (event instanceof core.CSAMoveEvent) {
                let { state, ctx } = game;
                if (!event.color.equals(game.state.nextTurn)) {
                    return violate(Violation.INVALID_TURN);
                }
                if (event.from === null) {
                    // ### Drop
                    if (!exports.DROPPABLE_PIECE_IDS.has(event.piece.id)) {
                        return violate(Violation.NOT_DROPPABLE_PIECE);
                    }
                    const hand = state.getHand(event.color);
                    if (!hand.has(event.piece)) {
                        return violate(Violation.NO_SPECIFIED_PIECE_IN_HAND);
                    }
                    const toCP = state.board.get(event.to);
                    if (toCP !== null) {
                        return violate(Violation.CANNOT_PUT_PIECE_ONTO_BOARD);
                    }
                    if (isNeverMovable(event.to, event.color, event.piece)) {
                        return violate(Violation.NOT_DROPPABLE_POSITION);
                    }
                    if (event.piece.isFU()) {
                        const cp = core.ColorPiece.from(event.color, event.piece);
                        for (const y of core.Position.INDICES) {
                            if (cp.equals(state.board.get([event.to.x, y]))) {
                                return violate(Violation.NIFU);
                            }
                        }
                    }
                    // TODO: Check uchifuzume
                    state = state.withMutations(mut => {
                        mut.update("board", x => x.set(event.to, new core.ColorPiece(event)));
                        mut.update(event.color.isBlack() ? "handBlack" : "handWhite", x => x.dec(event.piece));
                        mut.update("nextTurn", x => x.flip());
                        mut.update("moveNum", x => x + 1);
                    });
                    ctx = game.ctx.set("lastViolation", null);
                }
                else {
                    // ### Move
                    const fromCP = state.board.get(event.from);
                    if (fromCP === null) {
                        return violate(Violation.NO_SPECIFIED_PIECE_ON_BOARD);
                    }
                    if (!fromCP.color.equals(event.color)) {
                        return violate(Violation.NOT_MOVABLE_PIECE);
                    }
                    const candidates = getMoveCandidates(state.board, event.from);
                    if (!candidates.has(new MoveCandidate({ to: event.to, piece: event.piece }))) {
                        return violate(Violation.NOT_MOVABLE_POSITION);
                    }
                    const toCP = state.board.get(event.to);
                    state = state.withMutations(mut => {
                        mut.update("board", x => x.set(event.to, new core.ColorPiece(event)).delete(event.from));
                        if (toCP !== null) {
                            mut.update(event.color.isBlack() ? "handBlack" : "handWhite", x => x.inc(toCP.piece.heads()));
                        }
                        mut.update("nextTurn", x => x.flip());
                        mut.update("moveNum", x => x + 1);
                    });
                    // TODO: Check mate
                    ctx = game.ctx.set("lastViolation", null);
                }
                return new Game({ state, ctx });
            }
            if (event instanceof core.ResignEvent) {
                return game.updateIn(["ctx", "status"], (v) => GameStatus.END);
            }
            throw new Error("TODO");
        }
        case GameStatus.END: {
            return violate(Violation.UNACCEPTABLE_EVENT_FOR_STATE);
        }
    }
    throw new Error("invalid status");
};
class MoveEventBundle extends Immutable.Record({
    csa: new core.CSAMoveEvent(),
    usi: new core.USIMoveEvent(),
    japaneseNotation: new core.JapaneseNotationMoveEvent(),
}) {
    toUSIString() { return this.usi.toUSIString(); }
    toCSAString() { return this.csa.toCSAString(); }
    toJapaneseNotationString() { return this.japaneseNotation.toJapaneseNotationString(); }
}
exports.MoveEventBundle = MoveEventBundle;
function convertCSAMoveEventToUSIMoveEvent(csa, state) {
    if (csa.from) {
        const fromCP = state.board.get(csa.from);
        if (!fromCP) {
            return new Error("piece to be moved not found");
        }
        let promote = false;
        if (!fromCP.piece.equals(csa.piece)) {
            const p = fromCP.piece.tails();
            if (!p || !p.equals(csa.piece)) {
                return new Error("should be promotable");
            }
            promote = true;
        }
        return new core.USIMoveEvent({
            src: csa.from,
            to: csa.to,
            promote,
            time: csa.time,
        });
    }
    else {
        if (!state.getHand(csa.color).has(csa.piece)) {
            return new Error("piece to be dropped not found");
        }
        return new core.USIMoveEvent({
            src: csa.piece,
            to: csa.to,
            time: csa.time,
        });
    }
}
exports.convertCSAMoveEventToUSIMoveEvent = convertCSAMoveEventToUSIMoveEvent;
function convertCSAMoveEventToJapaneseNotationMoveEvent(csa, state, prevDst) {
    if (csa.from) {
        const fromCP = state.board.get(csa.from);
        if (!fromCP) {
            return new Error("piece to be moved not found");
        }
        let promote = null;
        if (fromCP.piece.equals(csa.piece)) {
            if (csa.piece.canPromote() && (isInPromortableArea(csa.from, csa.color) || isInPromortableArea(csa.to, csa.color))) {
                promote = core.PromotionNotation.NOT_PROMOTE;
            }
        }
        else {
            const p = fromCP.piece.tails();
            if (!p || !p.equals(csa.piece)) {
                return new Error("should be promotable");
            }
            promote = core.PromotionNotation.PROMOTE;
        }
        return new core.JapaneseNotationMoveEvent({
            color: csa.color,
            to: csa.to.equals(prevDst) ? "same" : csa.to,
            srcPiece: fromCP.piece,
            movement: null,
            promote,
            time: csa.time,
        });
    }
    else {
        if (!state.getHand(csa.color).has(csa.piece)) {
            return new Error("piece to be dropped not found");
        }
        return new core.JapaneseNotationMoveEvent({
            color: csa.color,
            to: csa.to.equals(prevDst) ? "same" : csa.to,
            srcPiece: csa.piece,
            movement: null,
            time: csa.time,
        });
    }
}
exports.convertCSAMoveEventToJapaneseNotationMoveEvent = convertCSAMoveEventToJapaneseNotationMoveEvent;
function getMoveEventBundle(state, moveEvent, prevDst) {
    if (moveEvent instanceof core.CSAMoveEvent) {
        const usi = convertCSAMoveEventToUSIMoveEvent(moveEvent, state);
        if (usi instanceof Error) {
            return usi;
        }
        const japaneseNotation = convertCSAMoveEventToJapaneseNotationMoveEvent(moveEvent, state, prevDst);
        if (japaneseNotation instanceof Error) {
            return japaneseNotation;
        }
        return new MoveEventBundle({ csa: moveEvent, usi, japaneseNotation });
    }
    if (moveEvent instanceof core.USIMoveEvent) {
        throw new Error("TODO");
        // return new MoveEventBundle({
        //   usi: moveEvent,
        // });
    }
    if (moveEvent instanceof core.JapaneseNotationMoveEvent) {
        throw new Error("TODO");
        // return new MoveEventBundle({
        //   japaneseNotation: moveEvent,
        // });
    }
    throw new Error("never reached");
}
exports.getMoveEventBundle = getMoveEventBundle;
//---
class EventResult extends Immutable.Record({
    game: new Game(),
    by: undefined,
}) {
    applyEvent(event, prevDst) {
        const game = exports.reducer(this.game, event);
        if (core.isMoveEvent(event)) {
            const bundle = getMoveEventBundle(this.game.state, event, prevDst);
            if (bundle instanceof Error) {
                throw bundle; // TODO: throw?
            }
            return new EventResult({ game, by: bundle });
        }
        else {
            return new EventResult({ game, by: event });
        }
    }
}
exports.EventResult = EventResult;
const INITIAL_EVENT_POINTER = new core.RecordEventPointer();
class GameManager {
    constructor(arg) {
        if (arg && arg instanceof GameManager) {
            this._record = arg._record;
            this._currentForkIndex = arg._currentForkIndex;
            this._currentEventPointer = arg._currentEventPointer;
            this._eventResults = arg._eventResults;
            return;
        }
        this._record = arg || new core.Record();
        this._currentForkIndex = core.RecordFork.MAINSTREAM;
        this._eventResults = Immutable.Map([
            [INITIAL_EVENT_POINTER, new EventResult({
                    game: new Game({ state: this._record.initialState }),
                })],
        ]);
        this._currentEventPointer = INITIAL_EVENT_POINTER;
        for (let forkIndex = core.RecordFork.MAINSTREAM; forkIndex < this._record.forks.size; forkIndex++) {
            this.sync(forkIndex);
        }
    }
    get currentForkIndex() { return this._currentForkIndex; }
    get currentEventIndex() { return Immutable.List(this.getEventPointers()).indexOf(this._currentEventPointer); }
    get currentEventPointer() { return this._currentEventPointer; }
    get currentEventResult() { return this._eventResults.get(this._currentEventPointer); }
    get currentGame() { return this.currentEventResult.game; }
    sync(forkIndex) {
        let lastEventResult = this._eventResults.get(INITIAL_EVENT_POINTER);
        let prevDst;
        for (const [ptr, event] of this._record.getEventEntries(forkIndex)) {
            let er = this._eventResults.get(ptr);
            if (!er) {
                er = lastEventResult.applyEvent(event, prevDst);
                this._eventResults = this._eventResults.set(ptr, er);
            }
            lastEventResult = er;
            if (er.by instanceof MoveEventBundle) {
                prevDst = er.by.csa.to;
            }
        }
    }
    /**
     * @return position <0> moves <1>
     * @see http://www.geocities.jp/shogidokoro/usi.html
     */
    toUSIPositionAndMoves() {
        return [
            this._record.initialState.toUSIString(),
            this.getEventResults()
                .filter(er => er.by instanceof MoveEventBundle)
                .map(er => er.by.toUSIString())
                .join(" "),
        ];
    }
    setEventPointer(ptr) {
        const ptrs = Immutable.List(this._record.getEventPointers(this._currentForkIndex));
        if (!ptrs.includes(ptr)) {
            return false;
        }
        this._currentEventPointer = ptr;
        return true;
    }
    getEventResults(forkIndex = this._currentForkIndex) {
        return this.getEventResultEntries(forkIndex).map(ent => ent[1]);
    }
    getEventResultEntries(forkIndex = this._currentForkIndex) {
        const r = [
            [INITIAL_EVENT_POINTER, this._eventResults.get(INITIAL_EVENT_POINTER)],
        ];
        for (const [ptr] of this._record.getEventEntries(forkIndex)) {
            const er = this._eventResults.get(ptr);
            if (!er) {
                throw new Error("assert");
            }
            r.push([ptr, er]);
        }
        return r;
    }
    getEventPointers(forkIndex = this._currentForkIndex) {
        return [
            INITIAL_EVENT_POINTER,
            ...this._record.getEventPointers(this._currentForkIndex),
        ];
    }
    goto(n, isOffset = false) {
        const ptrs = Immutable.List(this.getEventPointers());
        let idx = -1;
        if (isOffset) {
            idx = ptrs.indexOf(this._currentEventPointer);
            if (idx === -1) {
                return false;
            }
            idx += n;
        }
        else {
            idx = (ptrs.size + n) % ptrs.size;
        }
        const ptr = ptrs.get(idx);
        if (!ptr) {
            return false;
        }
        this._currentEventPointer = ptr;
        return true;
    }
    next(n = 1) { return this.goto(n, true); }
    prev(n = 1) { return this.goto(-n, true); }
    first() { return this.goto(0); }
    last() { return this.goto(-1); }
    start(time = luxon_1.DateTime.local()) {
        return this.addEvent(new core.StartEvent({ time }));
    }
    move(from, to, piece, time = luxon_1.DateTime.local()) {
        const event = new core.CSAMoveEvent({
            color: this.currentGame.state.nextTurn,
            from: core.Position.from(from),
            to: core.Position.from(to),
            piece,
            time,
        });
        return this.addEvent(event);
    }
    drop(to, piece, time = luxon_1.DateTime.local()) {
        const event = new core.CSAMoveEvent({
            color: this.currentGame.state.nextTurn,
            to: core.Position.from(to),
            piece,
            time,
        });
        return this.addEvent(event);
    }
    resign(time = luxon_1.DateTime.local()) {
        const event = new core.ResignEvent({
            color: this.currentGame.state.nextTurn,
            time,
        });
        return this.addEvent(event);
    }
    addEvent(event) {
        this._record = this._record.withMutations(mut => {
            // TODO: add event to proper fork
            mut.update("events", x => x.push(event));
        });
        this.sync(this._currentForkIndex);
        return this.next();
    }
}
exports.GameManager = GameManager;
//# sourceMappingURL=standard-rule.js.map