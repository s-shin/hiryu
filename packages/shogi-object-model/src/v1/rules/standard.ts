import * as tree from "@hiryu/tree";
import {
  Square,
  Color,
  Piece,
  ColorPiece,
  Board,
  State,
  Event,
  EventType,
  MoveEvent,
  Movement,
  promote,
  demote,
  canPromote,
  flipColor,
  getBoardSquare,
  setBoardSquare,
  isSquare,
  flipSquare,
  getHand,
  getNumPieces,
  addNumPieces,
  cloneState,
  cloneEvent,
  filterBoardSquare,
  squareEquals,
  SQUARE_NUMBERS,
  HIRATE_STATE,
  isCompleteMoveEvent,
  isHeads,
} from "../definitions";

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

let lastGameNodeId = 0;

export function generateGameNodeId(prefix = "som") {
  return `${prefix}#${++lastGameNodeId}`;
}

export interface GameNodeData {
  id: string;
  state: State;
  moveNum: number;
  byEvent?: Event;
  violations: Violation[];
}

export type GameNode = tree.Node<GameNodeData>;

export function newRootGameNode(state = HIRATE_STATE, moveNum = 0): GameNode {
  return tree.newRootNode({
    id: generateGameNodeId(),
    state,
    moveNum,
    violations: [],
  });
}

// export function cloneGameNode(
//   node: GameNode,
//   opts: {
//     recursiveParent?: boolean;
//   },
// ): GameNode {
//   const fixedOpts = {
//     recursiveParent: opts.recursiveParent !== undefined ? opts.recursiveParent : false,
//   };
//   return {
//     ...node,
//     byEvent: node.byEvent ? cloneEvent(node.byEvent) : undefined,
//     violations: [...node.violations],
//     children: [...node.children],
//     parent: !fixedOpts.recursiveParent
//       ? node.parent
//       : node.parent
//         ? cloneGameNode(node.parent, opts)
//         : undefined,
//   };
// }

// function findParent(leaf: GameNode, cond: (node: GameNode) => boolean): GameNode | null {
//   const node = leaf.parent;
//   return node ? (cond(node) ? node : findParent(node, cond)) : null;
// }

export function applyEvent(current: GameNode, event: Event): GameNodeData {
  const currentData = tree.getValue(current);
  const nextData: GameNodeData = {
    id: generateGameNodeId(),
    state: cloneState(currentData.state),
    moveNum: currentData.moveNum,
    byEvent: cloneEvent(event),
    violations: [],
  };

  const parent = tree.getParentNode(current);
  const parentData = parent && tree.getValue(parent);
  if (parentData && parentData.byEvent && parentData.byEvent.type === EventType.RESIGN) {
    nextData.violations.push(Violation.ALREADY_RESIGNED);
    return nextData;
  }

  switch (event.type) {
    case EventType.MOVE: {
      // check turn
      const prevMoveEventNode = tree.findParentNode(current, n => {
        const v = tree.getValue(n);
        return Boolean(v.byEvent && v.byEvent.type === EventType.MOVE);
      });
      const prevMoveEventNodeData = prevMoveEventNode && tree.getValue(prevMoveEventNode);
      if (prevMoveEventNodeData) {
        if (event.color !== prevMoveEventNodeData.state.nextTurn) {
          nextData.violations.push(Violation.BAD_TURN);
          // continue
        }
      }

      // check move on board or drop and fix some event props.
      let isDrop: boolean | null = null;
      const e = nextData.byEvent as MoveEvent;
      if (e.sameDstSquare) {
        if (!prevMoveEventNodeData) {
          nextData.violations.push(Violation.INVALID_MOVE_EVENT);
          return nextData;
        }
        const pe = prevMoveEventNodeData.byEvent as MoveEvent;
        e.dstSquare = pe.dstSquare!;
      }
      if (!e.dstSquare) {
        nextData.violations.push(Violation.INVALID_MOVE_EVENT);
        return nextData;
      }
      // dstSquare!
      if (prevMoveEventNodeData) {
        const pe = prevMoveEventNodeData.byEvent as MoveEvent;
        e.sameDstSquare = squareEquals(e.dstSquare, pe.dstSquare!);
      } else if (e.sameDstSquare === undefined) {
        e.sameDstSquare = false;
      }
      // sameDstSquare!
      if (e.srcSquare) {
        // # srcSquare
        isDrop = false;
        const cp = getBoardSquare(currentData.state.board, e.srcSquare);
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
          if (mightBePromoted && promote(e.srcPiece) !== e.dstPiece) {
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
        } else {
          e.promote = Boolean(e.promote);
          // ## promote!
          const dstPiece = e.promote ? promote(e.srcPiece) : e.srcPiece;
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
      } else if (e.srcPiece) {
        // in case of japanese notations style.
        // # srcPiece!
        if (
          e.srcSquare === null ||
          (event.movements && event.movements.indexOf(Movement.DROPPED) !== -1)
        ) {
          isDrop = true;
          if (e.promote || !isHeads(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
            nextData.violations.push(Violation.INVALID_MOVE_EVENT);
            return nextData;
          }
          e.srcSquare = null;
          e.dstPiece = e.srcPiece;
          e.promote = false;
          // ## srcSquare!, dstPiece!, promote!
        } else {
          const matches = filterBoardSquare(currentData.state.board, cp => {
            return cp !== null && cp.color === event.color && cp.piece === e.srcPiece;
          }) as Array<[ColorPiece, Square]>;
          if (matches.length === 0) {
            isDrop = true;
            if (e.promote || !isHeads(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
              nextData.violations.push(Violation.INVALID_MOVE_EVENT);
              return nextData;
            }
            e.srcSquare = null;
            e.dstPiece = e.srcPiece;
            e.promote = false;
            // ### srcSquare!, dstPiece!, promote!
          } else {
            const candidates: Array<{
              srcCP: ColorPiece;
              srcSq: Square;
              mcs: MoveCandidate[];
            }> = [];
            for (const m of matches) {
              const mcs = searchMoveCandidates(currentData.state.board, m[1]).filter(c =>
                squareEquals(c.dst, e.dstSquare!),
              );
              if (mcs.length > 0) {
                candidates.push({ srcCP: m[0], srcSq: m[1], mcs });
              }
            }
            if (candidates.length === 0) {
              isDrop = true;
              if (e.promote || !isHeads(e.srcPiece) || (e.dstPiece && e.dstPiece !== e.srcPiece)) {
                nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                return nextData;
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
                nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                return nextData;
              }
              // #### promote!
              const dstPiece = e.promote ? promote(e.srcPiece) : e.srcPiece;
              if (!dstPiece || (e.dstPiece && e.dstPiece !== dstPiece)) {
                nextData.violations.push(Violation.INVALID_MOVE_EVENT);
                return nextData;
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
        nextData.violations.push(Violation.INVALID_MOVE_EVENT);
        return nextData;
      }
      e.movements = []; // to be fixed
      // props without movements were fixed!
      if (!isCompleteMoveEvent(e)) {
        throw new Error("assert error: isCompleteMoveEvent");
      }

      if (isDrop) {
        // droppable piece?
        if (!isDroppablePiece(e.dstPiece)) {
          nextData.violations.push(Violation.NOT_DROPPABLE_PIECE);
          return nextData;
        }
        // have the piece?
        const hand = getHand(currentData.state.hands, e.color);
        const num = getNumPieces(hand, e.dstPiece);
        if (num === 0) {
          nextData.violations.push(Violation.NO_PIECE_TO_BE_DROPPED);
          return nextData;
        }
        // piece exists on the square to be dropped?
        if (getBoardSquare(currentData.state.board, e.dstSquare)) {
          nextData.violations.push(Violation.PIECE_EXISTS);
          return nextData;
        }
        // piece is movable after dropped?
        if (isNeverMovable(e.dstSquare, e.color, e.dstPiece)) {
          nextData.violations.push(Violation.NOT_MOVABLE_DROPPED_PIECE);
          return nextData;
        }
        // check nifu
        if (e.dstPiece === Piece.FU) {
          for (const y of SQUARE_NUMBERS) {
            const cp = getBoardSquare(currentData.state.board, [e.dstSquare[0], y]);
            if (cp && cp.color === e.color && cp.piece === Piece.FU) {
              nextData.violations.push(Violation.NIFU);
              break; // continue
            }
          }
        }
        // TODO: check uchifuzume
        // TODO: fix movements prop

        setBoardSquare(nextData.state.board, e.dstSquare, { color: e.color, piece: e.dstPiece });
        addNumPieces(getHand(nextData.state.hands, e.color), e.dstPiece, -1);
        nextData.state.nextTurn = flipColor(e.color);
        nextData.moveNum++;
      } else {
        const srcCP = getBoardSquare(currentData.state.board, e.srcSquare!);
        // TODO: このチェックは不要か、fix時点で出すべきか
        if (!srcCP || srcCP.color !== e.color) {
          nextData.violations.push(Violation.NO_PIECE_TO_BE_MOVED);
          return nextData;
        }
        const mcs = searchMoveCandidates(currentData.state.board, e.srcSquare!);
        const mc = mcs.find(mc => squareEquals(mc.dst, e.dstSquare!) && mc.promote === e.promote);
        if (!mc) {
          nextData.violations.push(Violation.NOT_MOVABLE_PIECE_TO_SQUARE);
          return nextData;
        }

        const dstCP = getBoardSquare(currentData.state.board, e.dstSquare);
        if (dstCP) {
          if (dstCP.color === e.color) {
            throw new Error("TODO");
          }
          // capture
          addNumPieces(
            getHand(nextData.state.hands, e.color),
            demote(dstCP.piece, dstCP.piece)!,
            1,
          );
        }

        setBoardSquare(nextData.state.board, e.srcSquare!, null);
        setBoardSquare(nextData.state.board, e.dstSquare, { color: e.color, piece: e.dstPiece });
        nextData.state.nextTurn = flipColor(e.color);
        nextData.moveNum++;
      }

      // TODO: sennichite

      return nextData;
    }
    case EventType.RESIGN: {
      return nextData;
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
  return (
    ((piece === Piece.FU || piece === Piece.KY) && bsq[1] <= 1) ||
    (piece === Piece.KE && bsq[1] <= 2)
  );
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
    if (
      canPromote(cp.piece) &&
      (isInPromortableArea(src, cp.color) || isInPromortableArea(dst, cp.color))
    ) {
      r.push({ dst, promote: true });
      canContinue = true;
    }
    if (dstCP && dstCP.color === flipColor(cp.color)) {
      // Stop traverse when a piece captured.
      return (canContinue = false);
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
    case Piece.KI:
    case Piece.TO:
    case Piece.NY:
    case Piece.NK:
    case Piece.NG: {
      for (const dp of [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [0, -1]]) {
        add(dp[0], dp[1]);
      }
      break;
    }
    case Piece.KA:
    case Piece.UM: {
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
    case Piece.HI:
    case Piece.RY: {
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
