import * as som from "../";

const standard = som.rules.standard;

describe("standard rule", () => {
  test("applyEvent", () => {
    const game = standard.newRootGameNode();
    const next = standard.applyEvent(game, {
      type: som.EventType.MOVE,
      color: som.Color.BLACK,
      srcSquare: [7, 7],
      dstSquare: [7, 6],
    });
    game.children.push(next);
    expect(next.state.nextTurn).toEqual(som.Color.WHITE);
    expect(next.moveNum).toEqual(1);
  });

  test("isNeverMovable", () => {
    expect(standard.isNeverMovable([1, 6], som.Color.BLACK, som.Piece.FU)).toBe(false);
    expect(standard.isNeverMovable([1, 1], som.Color.BLACK, som.Piece.FU)).toBe(true);
    expect(standard.isNeverMovable([1, 1], som.Color.BLACK, som.Piece.KY)).toBe(true);
    expect(standard.isNeverMovable([1, 2], som.Color.BLACK, som.Piece.KE)).toBe(true);
  });
});
