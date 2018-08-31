import * as som from "@hiryu/shogi-object-model";

export interface Game {
  current: som.rules.standard.GameNode;
}

export function newGame(): Game {
  return {
    current: som.rules.standard.newRootGameNode(),
  };
}

export function move(game: Game, from: som.Square, to: som.Square, promote = false): Game {
  const e: som.MoveEvent = {
    type: som.EventType.MOVE,
    color: game.current.state.nextTurn,
    srcSquare: from,
    dstSquare: to,
    promote,
  };
  return applyEvent(game, e);
}

export function drop(game: Game, piece: som.Piece, to: som.Square): Game {
  const e: som.MoveEvent = {
    type: som.EventType.MOVE,
    color: game.current.state.nextTurn,
    srcPiece: piece,
    dstSquare: to,
  };
  return applyEvent(game, e);
}

export function applyEvent(game: Game, e: som.Event): Game {
  const g: Game = {
    current: som.rules.standard.cloneGameNode(game.current, { withoutParent: true }),
  };
  const next = som.rules.standard.applyEvent(g.current, e);
  g.current.children.push(next);
  g.current = next;
  return g;
}
