import {
  Square, Color, Piece, ColorPiece, Board, State, Event, EventType, MoveEvent,
  Hand, Movement,
  promote, demote, canPromote, flipColor, getBoardSquare, setBoardSquare, isSquare, flipSquare, getHand,
  getNumPieces, addNumPieces, cloneState, cloneEvent,
  filterBoardSquare, squareEquals,
  SQUARE_NUMBERS, HIRATE_STATE, isCompleteMoveEvent,
} from "../definitions";
import { DeepReadonly } from "../../util";

export enum Violation {
  ALREADY_RESIGNED,
  INVALID_MOVE_EVENT,
  BAD_TURN,
  // drop violations
  NOT_DROPPABLE_PIECE,
  NO_PIECE_TO_BE_DROPPED,
  NOT_MOVABLE_DROPPED_PIECE,
  PIECE_EXISTS,
  UCHIFUZUME,
  NIFU,
  // move violations
  NOT_MOVABLE_PIECE_TO_SQUARE,
  NO_PIECE_TO_BE_MOVED,
  NO_SPECIFIED_PIECE_ON_BOARD,
}

export interface GameNode {
  state: State;
  moveNum: number;
  byEvent?: Event;
  violations: Violation[];
  children: GameNode[];
  parent?: GameNode;
}

export function newRootGameNode(state = HIRATE_STATE, moveNum = 1): GameNode {
  return {
    state,
    moveNum,
    violations: [],
    children: [],
  };
}

export function cloneGameNode(node: GameNode, opts = { withoutParent: false }): GameNode {
  return {
    ...node,
    byEvent: node.byEvent ? cloneEvent(node.byEvent) : undefined,
    violations: [...node.violations],
    children: [...node.children],
    parent: opts.withoutParent ? node.parent : (node.parent ? cloneGameNode(node.parent) : undefined),
  };
}

function findParent(leaf: GameNode, cond: (node: GameNode) => boolean): GameNode | null {
  const node = leaf.parent;
  return node ? (cond(node) ? node : findParent(node, cond)) : null;
}

export function applyEvent(node: DeepReadonly<GameNode>, event: DeepReadonly<Event>): GameNode {
  const ret: GameNode = {
    state: cloneState(node.state),
    moveNum: node.moveNum,
    byEvent: cloneEvent(event),
    violations: [],
    children: [],
    parent: node,
  };

  if (node.parent && node.parent.byEvent && node.parent.byEvent.type === EventType.RESIGN) {
    ret.violations.push(Violation.ALREADY_RESIGNED);
    return ret;
  }

  switch (event.type) {
    case EventType.MOVE: {
      // check turn
      const prevMoveEventNode = findParent(node, n => Boolean(n.byEvent && n.byEvent.type === EventType.MOVE));
      if (prevMoveEventNode) {
        if (event.color !== prevMoveEventNode.state.nextTurn) {
          ret.violations.push(Violation.BAD_TURN);
          // continue
        }
      }

      // check move on board or drop and fix some event props.
      let isDrop: boolean | null = null;
      const e = ret.byEvent as MoveEvent;
      if (e.sameDstSquare) {
        if (!prevMoveEventNode) {
          ret.violations.push(Violation.INVALID_MOVE_EVENT);
          return ret;
        }
        const pe = prevMoveEventNode.byEvent as MoveEvent;
        e.dstSquare = pe.dstSquare!;
      }
      if (!e.dstSquare) {
        ret.violations.push(Violation.INVALID_MOVE_EVENT);
        return ret;
      }
      // dstSquare!
      if (prevMoveEventNode) {
        const pe = prevMoveEventNode.byEvent as MoveEvent;
        e.sameDstSquare = e.dstSquare === pe.dstSquare!;
      } else if (e.sameDstSquare === undefined) {
        e.sameDstSquare = false;
      }
      // sameDstSquare!
      if (e.srcSquare) {
        // # srcSquare
        isDrop = false;
        const cp = getBoardSquare(node.state.board, e.srcSquare);
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
          if (mightBePromoted && promote(e.srcPiece) !== e.dstPiece) {
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
        } else {
          e.promote = Boolean(e.promote);
          // ## promote!
          const dstPiece = e.promote ? promote(e.srcPiece) : e.srcPiece;
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
      } else if (e.srcPiece) { // in case of japanese notations style.
        // # srcPiece!
        if (e.srcSquare === null || event.movements && event.movements.indexOf(Movement.DROPPED) !== -1) {
          isDrop = true;
          if (e.promote || !canPromote(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
            ret.violations.push(Violation.INVALID_MOVE_EVENT);
            return ret;
          }
          e.srcSquare = null;
          e.dstPiece = e.srcPiece;
          e.promote = false;
          // ## srcSquare!, dstPiece!, promote!
        } else {
          const matches = filterBoardSquare(node.state.board, cp => {
            return cp !== null && cp.color === event.color && cp.piece === e.srcPiece;
          }) as Array<[ColorPiece, Square]>;
          if (matches.length === 0) {
            isDrop = true;
            if (e.promote || !canPromote(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
              ret.violations.push(Violation.INVALID_MOVE_EVENT);
              return ret;
            }
            e.srcSquare = null;
            e.dstPiece = e.srcPiece;
            e.promote = false;
            // ### srcSquare!, dstPiece!, promote!
          } else {
            const candidates: Array<{
              srcCP: ColorPiece,
              srcSq: Square,
              mcs: MoveCandidate[],
            }> = [];
            for (const m of matches) {
              const mcs = searchMoveCandidates(node.state.board, m[1])
                .filter(c => squareEquals(c.dst, e.dstSquare!));
              if (mcs.length > 0) {
                candidates.push({ srcCP: m[0], srcSq: m[1], mcs });
              }
            }
            if (candidates.length === 0) {
              isDrop = true;
              if (e.promote || !canPromote(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
                ret.violations.push(Violation.INVALID_MOVE_EVENT);
                return ret;
              }
              e.srcSquare = null;
              e.dstPiece = e.srcPiece;
              e.promote = false;
              // #### srcSquare!, dstPiece!, promote!
            } else {
              isDrop = false;
              if (candidates.length > 1) {
                throw new Error("TODO");
              }
              const c = candidates[0];
              e.srcSquare = c.srcSq;
              // #### srcSquare!
              if (c.mcs.length === 1) {
                e.promote = c.mcs[0].promote;
              } else if (e.promote === undefined) {
                ret.violations.push(Violation.INVALID_MOVE_EVENT);
                return ret;
              }
              // #### promote!
              const dstPiece = e.promote ? promote(e.srcPiece) : e.srcPiece;
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
      } else {
        // NOTE: currently not supported more.
        ret.violations.push(Violation.INVALID_MOVE_EVENT);
        return ret;
      }
      e.movements = [];  // to be fixed
      // props without movements were fixed!
      if (!isCompleteMoveEvent(e)) {
        throw new Error("assert error: isCompleteMoveEvent");
      }

      if (isDrop) {
        // droppable piece?
        if (!isDroppablePiece(e.dstPiece)) {
          ret.violations.push(Violation.NOT_DROPPABLE_PIECE);
          return ret;
        }
        // have the piece?
        const hand: DeepReadonly<Hand> = getHand(node.state.hands, e.color);
        const num = getNumPieces(hand, e.dstPiece);
        if (num === 0) {
          ret.violations.push(Violation.NO_PIECE_TO_BE_DROPPED);
          return ret;
        }
        // piece exists on the square to be dropped?
        if (getBoardSquare(node.state.board, e.dstSquare)) {
          ret.violations.push(Violation.PIECE_EXISTS);
          return ret;
        }
        // piece is movable after dropped?
        if (isNeverMovable(e.dstSquare, e.color, e.dstPiece)) {
          ret.violations.push(Violation.NOT_MOVABLE_DROPPED_PIECE);
          return ret;
        }
        // check nifu
        if (e.dstPiece === Piece.FU) {
          for (const y of SQUARE_NUMBERS) {
            const cp = getBoardSquare(node.state.board, [e.dstSquare[0], y]);
            if (cp && cp.color === e.color && cp.piece === Piece.FU) {
              ret.violations.push(Violation.NIFU);
              break;  // continue
            }
          }
        }
        // TODO: check uchifuzume
        // TODO: fix movements prop

        setBoardSquare(ret.state.board, e.dstSquare, { color: e.color, piece: e.dstPiece });
        addNumPieces(getHand(ret.state.hands, e.color), e.dstPiece, -1);
        ret.state.nextTurn = flipColor(e.color);
        ret.moveNum++;
      } else {
        const srcCP = getBoardSquare(node.state.board, e.srcSquare!);
        // TODO: このチェックは不要か、fix時点で出すべきか
        if (!srcCP || srcCP.color !== e.color) {
          ret.violations.push(Violation.NO_PIECE_TO_BE_MOVED);
          return ret;
        }
        const mcs = searchMoveCandidates(node.state.board, e.srcSquare!);
        const mc = mcs.find(mc => squareEquals(mc.dst, e.dstSquare!) && mc.promote === e.promote);
        if (!mc) {
          ret.violations.push(Violation.NOT_MOVABLE_PIECE_TO_SQUARE);
          return ret;
        }

        const dstCP = getBoardSquare(node.state.board, e.dstSquare);
        if (dstCP) {
          if (dstCP.color === e.color) {
            throw new Error("TODO");
          }
          // capture
          addNumPieces(getHand(ret.state.hands, e.color), demote(dstCP.piece, dstCP.piece)!, 1);
        }

        setBoardSquare(ret.state.board, e.srcSquare!, null);
        setBoardSquare(ret.state.board, e.dstSquare, { color: e.color, piece: e.dstPiece });
        ret.state.nextTurn = flipColor(e.color);
        ret.moveNum++;
      }

      // TODO: sennichite

      return ret;
    }
    case EventType.RESIGN: {
      return ret;
    }
  }
  throw new Error(`invalid event type: ${(event as Event).type}`);
}

const DROPPABLE_PIECES: Piece[] = [
  Piece.FU,
  Piece.KY,
  Piece.KE,
  Piece.GI,
  Piece.KI,
  Piece.HI,
  Piece.KA,
];

export function isDroppablePiece(piece: Piece) {
  return DROPPABLE_PIECES.indexOf(piece) !== -1;
}

export function isInPromortableArea(sq: Square, color: Color) {
  return (color === Color.BLACK ? sq : flipSquare(sq))[1] <= 3;
}

export function isNeverMovable(sq: Square, color: Color, piece: Piece) {
  const bsq = color === Color.BLACK ? sq : flipSquare(sq);
  return ((piece === Piece.FU || piece === Piece.KY) && bsq[1] <= 1) || ((piece === Piece.KE) && bsq[1] <= 2);
}

export interface MoveCandidate {
  dst: Square;
  promote: boolean;
}

export function searchMoveCandidates(board: Board, src: Square): MoveCandidate[] {
  const cp = getBoardSquare(board, src);
  if (cp === null) {
    return [];
  }

  const sign = cp.color === Color.BLACK ? -1 : 1;

  const r: MoveCandidate[] = [];

  const add = (dx: number, dy: number) => {
    const dst = [src[0] + dx * sign, src[1] + dy * sign];
    if (!isSquare(dst)) {
      return false;
    }

    const dstCP = getBoardSquare(board, dst);
    if (dstCP && dstCP.color === cp.color) {
      return false;
    }

    let canContinue = false;
    if (!isNeverMovable(dst, cp.color, cp.piece)) {
      r.push({ dst, promote: false });
      canContinue = true;
    }
    if (canPromote(cp.piece) && (isInPromortableArea(src, cp.color) || isInPromortableArea(dst, cp.color))) {
      r.push({ dst, promote: true });
      canContinue = true;
    }
    if (dstCP && dstCP.color === flipColor(cp.color)) {
      // Stop traverse when a piece captured.
      return canContinue = false;
    }
    return canContinue;
  };

  switch (cp.piece) {
    case Piece.FU: {
      add(0, 1);
      break;
    }
    case Piece.KY: {
      for (const i of SQUARE_NUMBERS) {
        if (!add(0, i)) {
          break;
        }
      }
      break;
    }
    case Piece.KE: {
      for (const dx of [1, -1]) {
        add(dx, 2);
      }
      break;
    }
    case Piece.GI: {
      for (const dp of [[-1, 1], [0, 1], [1, 1], [-1, -1], [1, -1]]) {
        add(dp[0], dp[1]);
      }
      break;
    }
    case Piece.KI: case Piece.TO: case Piece.NY: case Piece.NK: case Piece.NG: {
      for (const dp of [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [0, -1]]) {
        add(dp[0], dp[1]);
      }
      break;
    }
    case Piece.KA: case Piece.UM: {
      for (const dp of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (const i of SQUARE_NUMBERS) {
          if (!add(dp[0] * i, dp[1] * i)) {
            break;
          }
        }
      }
      if (cp.piece === Piece.UM) {
        for (const dp of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
          add(dp[0], dp[1]);
        }
      }
      break;
    }
    case Piece.HI: case Piece.RY: {
      for (const dp of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
        for (const i of SQUARE_NUMBERS) {
          if (!add(dp[0] * i, dp[1] * i)) {
            break;
          }
        }
      }
      if (cp.piece === Piece.RY) {
        for (const dp of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          add(dp[0], dp[1]);
        }
      }
      break;
    }
    case Piece.OU: {
      for (const dp of [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]]) {
        add(dp[0], dp[1]);
      }
      break;
    }
  }

  return r;
}

export function canDrop(cp: ColorPiece, board: Board, dst: Square) {
  return !getBoardSquare(board, dst) && !isNeverMovable(dst, cp.color, cp.piece);
}

export interface DropCandidate {
  dst: Square;
}

export function searchDropCandidates(board: Board, cp: ColorPiece): DropCandidate[] {
  const r: DropCandidate[] = [];
  for (const y of SQUARE_NUMBERS) {
    for (const x of SQUARE_NUMBERS) {
      const dst = [x, y] as Square;
      if (canDrop(cp, board, dst)) {
        r.push({ dst });
      }
    }
  }
  return r;
}
