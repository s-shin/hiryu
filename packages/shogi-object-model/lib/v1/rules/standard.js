"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function newRootGameNode(state = definitions_1.HIRATE_STATE, moveNum = 0) {
    return {
        state,
        moveNum,
        violations: [],
        children: [],
    };
}
exports.newRootGameNode = newRootGameNode;
function cloneGameNode(node, opts = { withoutParent: false }) {
    return Object.assign({}, node, { byEvent: node.byEvent ? definitions_1.cloneEvent(node.byEvent) : undefined, violations: [...node.violations], children: [...node.children], parent: opts.withoutParent ? node.parent : (node.parent ? cloneGameNode(node.parent) : undefined) });
}
exports.cloneGameNode = cloneGameNode;
function findParent(leaf, cond) {
    const node = leaf.parent;
    return node ? (cond(node) ? node : findParent(node, cond)) : null;
}
function applyEvent(node, event) {
    const ret = {
        state: definitions_1.cloneState(node.state),
        moveNum: node.moveNum,
        byEvent: definitions_1.cloneEvent(event),
        violations: [],
        children: [],
        parent: node,
    };
    if (node.parent && node.parent.byEvent && node.parent.byEvent.type === definitions_1.EventType.RESIGN) {
        ret.violations.push(Violation.ALREADY_RESIGNED);
        return ret;
    }
    switch (event.type) {
        case definitions_1.EventType.MOVE: {
            // check turn
            const isMoveEventNode = (n) => Boolean(n.byEvent && n.byEvent.type === definitions_1.EventType.MOVE);
            const prevMoveEventNode = isMoveEventNode(node) ? node : findParent(node, isMoveEventNode);
            if (prevMoveEventNode) {
                if (event.color !== prevMoveEventNode.state.nextTurn) {
                    ret.violations.push(Violation.BAD_TURN);
                    // continue
                }
            }
            // check move on board or drop and fix some event props.
            let isDrop = null;
            const e = ret.byEvent;
            if (e.sameDstSquare) {
                if (!prevMoveEventNode) {
                    ret.violations.push(Violation.INVALID_MOVE_EVENT);
                    return ret;
                }
                const pe = prevMoveEventNode.byEvent;
                e.dstSquare = pe.dstSquare;
            }
            if (!e.dstSquare) {
                ret.violations.push(Violation.INVALID_MOVE_EVENT);
                return ret;
            }
            // dstSquare!
            if (prevMoveEventNode) {
                const pe = prevMoveEventNode.byEvent;
                e.sameDstSquare = e.dstSquare === pe.dstSquare;
            }
            else if (e.sameDstSquare === undefined) {
                e.sameDstSquare = false;
            }
            // sameDstSquare!
            if (e.srcSquare) {
                // # srcSquare
                isDrop = false;
                const cp = definitions_1.getBoardSquare(node.state.board, e.srcSquare);
                if (!cp) {
                    ret.violations.push(Violation.INVALID_MOVE_EVENT);
                    return ret;
                }
                if (e.srcPiece && e.srcPiece !== cp.piece) {
                    ret.violations.push(Violation.INVALID_MOVE_EVENT);
                    return ret;
                }
                e.srcPiece = cp.piece;
                // # srcPiece!
                if (e.dstPiece) {
                    // ## dstPiece!
                    const mightBePromoted = e.srcPiece !== e.dstPiece;
                    if (mightBePromoted && definitions_1.promote(e.srcPiece) !== e.dstPiece) {
                        ret.violations.push(Violation.INVALID_MOVE_EVENT);
                        return ret;
                    }
                    const isPromoted = mightBePromoted;
                    if (isPromoted && e.promote === false) {
                        ret.violations.push(Violation.INVALID_MOVE_EVENT);
                        return ret;
                    }
                    e.promote = isPromoted;
                    // ## promote!
                }
                else {
                    e.promote = Boolean(e.promote);
                    // ## promote!
                    const dstPiece = e.promote ? definitions_1.promote(e.srcPiece) : e.srcPiece;
                    if (!dstPiece || (e.dstPiece && e.dstPiece !== dstPiece)) {
                        ret.violations.push(Violation.INVALID_MOVE_EVENT);
                        return ret;
                    }
                    e.dstPiece = dstPiece;
                    // ## dstPiece!
                }
                if (!e.dstPiece || e.promote === undefined) {
                    throw new Error("assert");
                }
                // # dstPiece!, promote!
            }
            else if (e.srcPiece) { // in case of japanese notations style.
                // # srcPiece!
                if (e.srcSquare === null || event.movements && event.movements.indexOf(definitions_1.Movement.DROPPED) !== -1) {
                    isDrop = true;
                    if (e.promote || !definitions_1.canPromote(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
                        ret.violations.push(Violation.INVALID_MOVE_EVENT);
                        return ret;
                    }
                    e.srcSquare = null;
                    e.dstPiece = e.srcPiece;
                    e.promote = false;
                    // ## srcSquare!, dstPiece!, promote!
                }
                else {
                    const matches = definitions_1.filterBoardSquare(node.state.board, cp => {
                        return cp !== null && cp.color === event.color && cp.piece === e.srcPiece;
                    });
                    if (matches.length === 0) {
                        isDrop = true;
                        if (e.promote || !definitions_1.canPromote(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
                            ret.violations.push(Violation.INVALID_MOVE_EVENT);
                            return ret;
                        }
                        e.srcSquare = null;
                        e.dstPiece = e.srcPiece;
                        e.promote = false;
                        // ### srcSquare!, dstPiece!, promote!
                    }
                    else {
                        const candidates = [];
                        for (const m of matches) {
                            const mcs = searchMoveCandidates(node.state.board, m[1])
                                .filter(c => definitions_1.squareEquals(c.dst, e.dstSquare));
                            if (mcs.length > 0) {
                                candidates.push({ srcCP: m[0], srcSq: m[1], mcs });
                            }
                        }
                        if (candidates.length === 0) {
                            isDrop = true;
                            if (e.promote || !definitions_1.canPromote(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
                                ret.violations.push(Violation.INVALID_MOVE_EVENT);
                                return ret;
                            }
                            e.srcSquare = null;
                            e.dstPiece = e.srcPiece;
                            e.promote = false;
                            // #### srcSquare!, dstPiece!, promote!
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
                                ret.violations.push(Violation.INVALID_MOVE_EVENT);
                                return ret;
                            }
                            // #### promote!
                            const dstPiece = e.promote ? definitions_1.promote(e.srcPiece) : e.srcPiece;
                            if (!dstPiece || (e.dstPiece && e.dstPiece !== dstPiece)) {
                                ret.violations.push(Violation.INVALID_MOVE_EVENT);
                                return ret;
                            }
                            e.dstPiece = dstPiece;
                            // #### dstPiece!
                        }
                        // ### srcSquare!, dstPiece!, promote!
                    }
                    // ## srcSquare!, dstPiece!, promote!
                }
                // # srcSquare!, dstPiece!, promote!
            }
            else {
                // NOTE: currently not supported more.
                ret.violations.push(Violation.INVALID_MOVE_EVENT);
                return ret;
            }
            e.movements = []; // to be fixed
            // props without movements were fixed!
            if (!definitions_1.isCompleteMoveEvent(e)) {
                throw new Error("assert error: isCompleteMoveEvent");
            }
            if (isDrop) {
                // droppable piece?
                if (!isDroppablePiece(e.dstPiece)) {
                    ret.violations.push(Violation.NOT_DROPPABLE_PIECE);
                    return ret;
                }
                // have the piece?
                const hand = definitions_1.getHand(node.state.hands, e.color);
                const num = definitions_1.getNumPieces(hand, e.dstPiece);
                if (num === 0) {
                    ret.violations.push(Violation.NO_PIECE_TO_BE_DROPPED);
                    return ret;
                }
                // piece exists on the square to be dropped?
                if (definitions_1.getBoardSquare(node.state.board, e.dstSquare)) {
                    ret.violations.push(Violation.PIECE_EXISTS);
                    return ret;
                }
                // piece is movable after dropped?
                if (isNeverMovable(e.dstSquare, e.color, e.dstPiece)) {
                    ret.violations.push(Violation.NOT_MOVABLE_DROPPED_PIECE);
                    return ret;
                }
                // check nifu
                if (e.dstPiece === definitions_1.Piece.FU) {
                    for (const y of definitions_1.SQUARE_NUMBERS) {
                        const cp = definitions_1.getBoardSquare(node.state.board, [e.dstSquare[0], y]);
                        if (cp && cp.color === e.color && cp.piece === definitions_1.Piece.FU) {
                            ret.violations.push(Violation.NIFU);
                            break; // continue
                        }
                    }
                }
                // TODO: check uchifuzume
                // TODO: fix movements prop
                definitions_1.setBoardSquare(ret.state.board, e.dstSquare, { color: e.color, piece: e.dstPiece });
                definitions_1.addNumPieces(definitions_1.getHand(ret.state.hands, e.color), e.dstPiece, -1);
                ret.state.nextTurn = definitions_1.flipColor(e.color);
                ret.moveNum++;
            }
            else {
                const srcCP = definitions_1.getBoardSquare(node.state.board, e.srcSquare);
                // TODO: このチェックは不要か、fix時点で出すべきか
                if (!srcCP || srcCP.color !== e.color) {
                    ret.violations.push(Violation.NO_PIECE_TO_BE_MOVED);
                    return ret;
                }
                const mcs = searchMoveCandidates(node.state.board, e.srcSquare);
                const mc = mcs.find(mc => definitions_1.squareEquals(mc.dst, e.dstSquare) && mc.promote === e.promote);
                if (!mc) {
                    ret.violations.push(Violation.NOT_MOVABLE_PIECE_TO_SQUARE);
                    return ret;
                }
                const dstCP = definitions_1.getBoardSquare(node.state.board, e.dstSquare);
                if (dstCP) {
                    if (dstCP.color === e.color) {
                        throw new Error("TODO");
                    }
                    // capture
                    definitions_1.addNumPieces(definitions_1.getHand(ret.state.hands, e.color), definitions_1.demote(dstCP.piece, dstCP.piece), 1);
                }
                definitions_1.setBoardSquare(ret.state.board, e.srcSquare, null);
                definitions_1.setBoardSquare(ret.state.board, e.dstSquare, { color: e.color, piece: e.dstPiece });
                ret.state.nextTurn = definitions_1.flipColor(e.color);
                ret.moveNum++;
            }
            // TODO: sennichite
            return ret;
        }
        case definitions_1.EventType.RESIGN: {
            return ret;
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
    return ((piece === definitions_1.Piece.FU || piece === definitions_1.Piece.KY) && bsq[1] <= 1) || ((piece === definitions_1.Piece.KE) && bsq[1] <= 2);
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
        if (definitions_1.canPromote(cp.piece) && (isInPromortableArea(src, cp.color) || isInPromortableArea(dst, cp.color))) {
            r.push({ dst, promote: true });
            canContinue = true;
        }
        if (dstCP && dstCP.color === definitions_1.flipColor(cp.color)) {
            // Stop traverse when a piece captured.
            return canContinue = false;
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