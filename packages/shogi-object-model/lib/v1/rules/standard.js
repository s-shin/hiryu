"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tree = __importStar(require("@hiryu/tree"));
const definitions_1 = require("../definitions");
var Violation;
(function (Violation) {
    Violation[Violation["ALREADY_RESIGNED"] = 0] = "ALREADY_RESIGNED";
    Violation[Violation["INVALID_MOVE_EVENT"] = 1] = "INVALID_MOVE_EVENT";
    Violation[Violation["BAD_TURN"] = 2] = "BAD_TURN";
    // drop violations
    Violation[Violation["NOT_DROPPABLE_PIECE"] = 3] = "NOT_DROPPABLE_PIECE";
    Violation[Violation["NO_PIECE_TO_BE_DROPPED"] = 4] = "NO_PIECE_TO_BE_DROPPED";
    Violation[Violation["NOT_MOVABLE_DROPPED_PIECE"] = 5] = "NOT_MOVABLE_DROPPED_PIECE";
    Violation[Violation["PIECE_EXISTS"] = 6] = "PIECE_EXISTS";
    Violation[Violation["UCHIFUZUME"] = 7] = "UCHIFUZUME";
    Violation[Violation["NIFU"] = 8] = "NIFU";
    // move violations
    Violation[Violation["NOT_MOVABLE_PIECE_TO_SQUARE"] = 9] = "NOT_MOVABLE_PIECE_TO_SQUARE";
    Violation[Violation["NO_PIECE_TO_BE_MOVED"] = 10] = "NO_PIECE_TO_BE_MOVED";
    Violation[Violation["NO_SPECIFIED_PIECE_ON_BOARD"] = 11] = "NO_SPECIFIED_PIECE_ON_BOARD";
})(Violation = exports.Violation || (exports.Violation = {}));
let lastGameNodeId = 0;
function generateGameNodeId(prefix = "som") {
    return `${prefix}#${++lastGameNodeId}`;
}
exports.generateGameNodeId = generateGameNodeId;
function newRootGameNode(state = definitions_1.HIRATE_STATE, moveNum = 0) {
    return tree.newRootNode({
        id: generateGameNodeId(),
        state,
        moveNum,
        violations: [],
    });
}
exports.newRootGameNode = newRootGameNode;
function applyEvent(current, event) {
    const currentData = tree.getValue(current);
    const nextData = {
        id: generateGameNodeId(),
        state: definitions_1.cloneState(currentData.state),
        moveNum: currentData.moveNum,
        byEvent: definitions_1.cloneEvent(event),
        violations: [],
    };
    const parent = tree.getParentNode(current);
    const parentData = parent && tree.getValue(parent);
    if (parentData && parentData.byEvent && parentData.byEvent.type === definitions_1.EventType.RESIGN) {
        nextData.violations.push(Violation.ALREADY_RESIGNED);
        return nextData;
    }
    switch (event.type) {
        case definitions_1.EventType.MOVE: {
            // check turn
            const prevMoveEventNode = tree.findParentNode(current, n => {
                const v = tree.getValue(n);
                return Boolean(v.byEvent && v.byEvent.type === definitions_1.EventType.MOVE);
            });
            const prevMoveEventNodeData = prevMoveEventNode && tree.getValue(prevMoveEventNode);
            if (prevMoveEventNodeData) {
                if (event.color !== prevMoveEventNodeData.state.nextTurn) {
                    nextData.violations.push(Violation.BAD_TURN);
                    // continue
                }
            }
            // check move on board or drop and fix some event props.
            let isDrop = null;
            const e = nextData.byEvent;
            if (e.sameDstSquare) {
                if (!prevMoveEventNodeData) {
                    nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                    return nextData;
                }
                const pe = prevMoveEventNodeData.byEvent;
                e.dstSquare = pe.dstSquare;
            }
            if (!e.dstSquare) {
                nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                return nextData;
            }
            // dstSquare!
            if (prevMoveEventNodeData) {
                const pe = prevMoveEventNodeData.byEvent;
                e.sameDstSquare = definitions_1.squareEquals(e.dstSquare, pe.dstSquare);
            }
            else if (e.sameDstSquare === undefined) {
                e.sameDstSquare = false;
            }
            // sameDstSquare!
            if (e.srcSquare) {
                // # srcSquare
                isDrop = false;
                const cp = definitions_1.getBoardSquare(currentData.state.board, e.srcSquare);
                if (!cp) {
                    nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                    return nextData;
                }
                if (e.srcPiece && e.srcPiece !== cp.piece) {
                    nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                    return nextData;
                }
                e.srcPiece = cp.piece;
                // # srcPiece!
                if (e.dstPiece) {
                    // ## dstPiece!
                    const mightBePromoted = e.srcPiece !== e.dstPiece;
                    if (mightBePromoted && definitions_1.promote(e.srcPiece) !== e.dstPiece) {
                        nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                        return nextData;
                    }
                    const isPromoted = mightBePromoted;
                    if (isPromoted && e.promote === false) {
                        nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                        return nextData;
                    }
                    e.promote = isPromoted;
                    // ## promote!
                }
                else {
                    e.promote = Boolean(e.promote);
                    // ## promote!
                    const dstPiece = e.promote ? definitions_1.promote(e.srcPiece) : e.srcPiece;
                    if (!dstPiece || (e.dstPiece && e.dstPiece !== dstPiece)) {
                        nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                        return nextData;
                    }
                    e.dstPiece = dstPiece;
                    // ## dstPiece!
                }
                if (!e.dstPiece || e.promote === undefined) {
                    throw new Error("assert");
                }
                // # dstPiece!, promote!
            }
            else if (e.srcPiece || e.dstPiece) {
                const piece = (e.srcPiece || e.dstPiece);
                const shouldDrop = () => {
                    isDrop = true;
                    if (e.promote ||
                        !definitions_1.isHeads(piece) ||
                        (e.dstPiece && e.dstPiece !== piece) ||
                        (e.srcPiece && e.srcPiece !== piece)) {
                        nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                        return nextData;
                    }
                    e.srcSquare = null;
                    e.srcPiece = piece;
                    e.dstPiece = piece;
                    e.promote = false;
                    return null;
                };
                // in case of japanese notations style.
                // # srcPiece!
                if (e.srcSquare === null ||
                    (event.movements && event.movements.indexOf(definitions_1.Movement.DROPPED) !== -1)) {
                    const r = shouldDrop();
                    if (r) {
                        return r;
                    }
                    // ## srcSquare!, srcPiece!, dstPiece!, promote!
                }
                else {
                    const matches = definitions_1.filterBoardSquare(currentData.state.board, cp => {
                        return cp !== null && cp.color === event.color && cp.piece === piece;
                    });
                    if (matches.length === 0) {
                        const r = shouldDrop();
                        if (r) {
                            return r;
                        }
                        // ## srcSquare!, srcPiece!, dstPiece!, promote!
                    }
                    else {
                        const candidates = [];
                        for (const m of matches) {
                            const mcs = searchMoveCandidates(currentData.state.board, m[1]).filter(c => definitions_1.squareEquals(c.dst, e.dstSquare));
                            if (mcs.length > 0) {
                                candidates.push({ srcCP: m[0], srcSq: m[1], mcs });
                            }
                        }
                        if (candidates.length === 0) {
                            const r = shouldDrop();
                            if (r) {
                                return r;
                            }
                            // ## srcSquare!, srcPiece!, dstPiece!, promote!
                        }
                        else {
                            isDrop = false;
                            if (candidates.length > 1) {
                                throw new Error("TODO");
                            }
                            const c = candidates[0];
                            e.srcSquare = c.srcSq;
                            // #### srcSquare!
                            if (c.mcs.length === 1) {
                                e.promote = c.mcs[0].promote;
                            }
                            else if (e.promote === undefined) {
                                nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                                return nextData;
                            }
                            // #### promote!
                            if (e.dstPiece) {
                                // ##### e.dstPiece!
                                if (e.promote && definitions_1.isHeads(e.dstPiece)) {
                                    nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                                    return nextData;
                                }
                                e.srcPiece = e.dstPiece;
                            }
                            else {
                                // ##### e.srcPiece!
                                const dstPiece = e.promote ? definitions_1.promote(piece) : piece;
                                if (!dstPiece) {
                                    nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                                    return nextData;
                                }
                                e.dstPiece = dstPiece;
                            }
                            // #### srcPiece!, dstPiece!
                        }
                        // ### srcSquare!, dstPiece!, promote!
                    }
                    // ## srcSquare!, dstPiece!, promote!
                }
                // # srcSquare!, dstPiece!, promote!
            }
            else {
                // NOTE: currently not supported more.
                nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                return nextData;
            }
            e.movements = []; // to be fixed
            // props without movements were fixed!
            if (!definitions_1.isCompleteMoveEvent(e)) {
                throw new Error("assert error: isCompleteMoveEvent");
            }
            if (isDrop) {
                // droppable piece?
                if (!isDroppablePiece(e.dstPiece)) {
                    nextData.violations.push(Violation.NOT_DROPPABLE_PIECE);
                    return nextData;
                }
                // have the piece?
                const hand = definitions_1.getHand(currentData.state.hands, e.color);
                const num = definitions_1.getNumPieces(hand, e.dstPiece);
                if (num === 0) {
                    nextData.violations.push(Violation.NO_PIECE_TO_BE_DROPPED);
                    return nextData;
                }
                // piece exists on the square to be dropped?
                if (definitions_1.getBoardSquare(currentData.state.board, e.dstSquare)) {
                    nextData.violations.push(Violation.PIECE_EXISTS);
                    return nextData;
                }
                // piece is movable after dropped?
                if (isNeverMovable(e.dstSquare, e.color, e.dstPiece)) {
                    nextData.violations.push(Violation.NOT_MOVABLE_DROPPED_PIECE);
                    return nextData;
                }
                // check nifu
                if (e.dstPiece === definitions_1.Piece.FU) {
                    for (const y of definitions_1.SQUARE_NUMBERS) {
                        const cp = definitions_1.getBoardSquare(currentData.state.board, [e.dstSquare[0], y]);
                        if (cp && cp.color === e.color && cp.piece === definitions_1.Piece.FU) {
                            nextData.violations.push(Violation.NIFU);
                            break; // continue
                        }
                    }
                }
                // TODO: check uchifuzume
                // TODO: fix movements prop
                definitions_1.setBoardSquare(nextData.state.board, e.dstSquare, { color: e.color, piece: e.dstPiece });
                definitions_1.addNumPieces(definitions_1.getHand(nextData.state.hands, e.color), e.dstPiece, -1);
                nextData.state.nextTurn = definitions_1.flipColor(e.color);
                nextData.moveNum++;
            }
            else {
                const srcCP = definitions_1.getBoardSquare(currentData.state.board, e.srcSquare);
                // TODO: このチェックは不要か、fix時点で出すべきか
                if (!srcCP || srcCP.color !== e.color) {
                    nextData.violations.push(Violation.NO_PIECE_TO_BE_MOVED);
                    return nextData;
                }
                const mcs = searchMoveCandidates(currentData.state.board, e.srcSquare);
                const mc = mcs.find(mc => definitions_1.squareEquals(mc.dst, e.dstSquare) && mc.promote === e.promote);
                if (!mc) {
                    nextData.violations.push(Violation.NOT_MOVABLE_PIECE_TO_SQUARE);
                    return nextData;
                }
                const dstCP = definitions_1.getBoardSquare(currentData.state.board, e.dstSquare);
                if (dstCP) {
                    if (dstCP.color === e.color) {
                        throw new Error("TODO");
                    }
                    // capture
                    definitions_1.addNumPieces(definitions_1.getHand(nextData.state.hands, e.color), definitions_1.demote(dstCP.piece, dstCP.piece), 1);
                }
                definitions_1.setBoardSquare(nextData.state.board, e.srcSquare, null);
                definitions_1.setBoardSquare(nextData.state.board, e.dstSquare, { color: e.color, piece: e.dstPiece });
                nextData.state.nextTurn = definitions_1.flipColor(e.color);
                nextData.moveNum++;
            }
            // TODO: sennichite
            return nextData;
        }
        case definitions_1.EventType.RESIGN: {
            return nextData;
        }
    }
    throw new Error(`invalid event type: ${event.type}`);
}
exports.applyEvent = applyEvent;
const DROPPABLE_PIECES = [
    definitions_1.Piece.FU,
    definitions_1.Piece.KY,
    definitions_1.Piece.KE,
    definitions_1.Piece.GI,
    definitions_1.Piece.KI,
    definitions_1.Piece.HI,
    definitions_1.Piece.KA,
];
function isDroppablePiece(piece) {
    return DROPPABLE_PIECES.indexOf(piece) !== -1;
}
exports.isDroppablePiece = isDroppablePiece;
function isInPromortableArea(sq, color) {
    return (color === definitions_1.Color.BLACK ? sq : definitions_1.flipSquare(sq))[1] <= 3;
}
exports.isInPromortableArea = isInPromortableArea;
function isNeverMovable(sq, color, piece) {
    const bsq = color === definitions_1.Color.BLACK ? sq : definitions_1.flipSquare(sq);
    return (((piece === definitions_1.Piece.FU || piece === definitions_1.Piece.KY) && bsq[1] <= 1) ||
        (piece === definitions_1.Piece.KE && bsq[1] <= 2));
}
exports.isNeverMovable = isNeverMovable;
function searchMoveCandidates(board, src) {
    const cp = definitions_1.getBoardSquare(board, src);
    if (cp === null) {
        return [];
    }
    const sign = cp.color === definitions_1.Color.BLACK ? -1 : 1;
    const r = [];
    const add = (dx, dy) => {
        const dst = [src[0] + dx * sign, src[1] + dy * sign];
        if (!definitions_1.isSquare(dst)) {
            return false;
        }
        const dstCP = definitions_1.getBoardSquare(board, dst);
        if (dstCP && dstCP.color === cp.color) {
            return false;
        }
        let canContinue = false;
        if (!isNeverMovable(dst, cp.color, cp.piece)) {
            r.push({ dst, promote: false });
            canContinue = true;
        }
        if (definitions_1.canPromote(cp.piece) &&
            (isInPromortableArea(src, cp.color) || isInPromortableArea(dst, cp.color))) {
            r.push({ dst, promote: true });
            canContinue = true;
        }
        if (dstCP && dstCP.color === definitions_1.flipColor(cp.color)) {
            // Stop traverse when a piece captured.
            return (canContinue = false);
        }
        return canContinue;
    };
    switch (cp.piece) {
        case definitions_1.Piece.FU: {
            add(0, 1);
            break;
        }
        case definitions_1.Piece.KY: {
            for (const i of definitions_1.SQUARE_NUMBERS) {
                if (!add(0, i)) {
                    break;
                }
            }
            break;
        }
        case definitions_1.Piece.KE: {
            for (const dx of [1, -1]) {
                add(dx, 2);
            }
            break;
        }
        case definitions_1.Piece.GI: {
            for (const dp of [[-1, 1], [0, 1], [1, 1], [-1, -1], [1, -1]]) {
                add(dp[0], dp[1]);
            }
            break;
        }
        case definitions_1.Piece.KI:
        case definitions_1.Piece.TO:
        case definitions_1.Piece.NY:
        case definitions_1.Piece.NK:
        case definitions_1.Piece.NG: {
            for (const dp of [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [0, -1]]) {
                add(dp[0], dp[1]);
            }
            break;
        }
        case definitions_1.Piece.KA:
        case definitions_1.Piece.UM: {
            for (const dp of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                for (const i of definitions_1.SQUARE_NUMBERS) {
                    if (!add(dp[0] * i, dp[1] * i)) {
                        break;
                    }
                }
            }
            if (cp.piece === definitions_1.Piece.UM) {
                for (const dp of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
                    add(dp[0], dp[1]);
                }
            }
            break;
        }
        case definitions_1.Piece.HI:
        case definitions_1.Piece.RY: {
            for (const dp of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
                for (const i of definitions_1.SQUARE_NUMBERS) {
                    if (!add(dp[0] * i, dp[1] * i)) {
                        break;
                    }
                }
            }
            if (cp.piece === definitions_1.Piece.RY) {
                for (const dp of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                    add(dp[0], dp[1]);
                }
            }
            break;
        }
        case definitions_1.Piece.OU: {
            for (const dp of [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]]) {
                add(dp[0], dp[1]);
            }
            break;
        }
    }
    return r;
}
exports.searchMoveCandidates = searchMoveCandidates;
function canDrop(cp, board, dst) {
    return !definitions_1.getBoardSquare(board, dst) && !isNeverMovable(dst, cp.color, cp.piece);
}
exports.canDrop = canDrop;
function searchDropCandidates(board, cp) {
    const r = [];
    for (const y of definitions_1.SQUARE_NUMBERS) {
        for (const x of definitions_1.SQUARE_NUMBERS) {
            const dst = [x, y];
            if (canDrop(cp, board, dst)) {
                r.push({ dst });
            }
        }
    }
    return r;
}
exports.searchDropCandidates = searchDropCandidates;
//# sourceMappingURL=standard.js.map