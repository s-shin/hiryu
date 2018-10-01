import * as som from "../";
import * as tree from "@hiryu/tree";

const standard = som.rules.standard;

describe("standard rule", () => {
  test("applyEvent", () => {
    let game = standard.newRootGameNode();
    let data = standard.applyEvent(game, {
      type: som.EventType.MOVE,
      color: som.Color.BLACK,
      srcSquare: [7, 7],
      dstSquare: [7, 6],
    });
    expect(data.violations.length).toBe(0);
    expect(data.state.nextTurn).toEqual(som.Color.WHITE);
    expect(data.moveNum).toEqual(1);
    game = tree.appendChild(game, data);

    [
      { color: som.Color.WHITE, srcSquare: [3, 3], dstSquare: [3, 4] },
      { color: som.Color.BLACK, srcSquare: [8, 8], dstSquare: [2, 2], promote: true },
      { color: som.Color.WHITE, srcSquare: [3, 1], dstSquare: [2, 2] },
      { color: som.Color.BLACK, srcSquare: null, dstSquare: [5, 5], srcPiece: som.Piece.KA },
    ].forEach((e, i) => {
      data = standard.applyEvent(game, { type: som.EventType.MOVE, ...e } as any);
      expect([i, data.violations]).toEqual([i, []]);
      game = tree.appendChild(game, data);
    });

    expect(data.state.nextTurn).toEqual(som.Color.WHITE);
    expect(data.moveNum).toEqual(5);
  });

  test("isNeverMovable", () => {
    expect(standard.isNeverMovable([1, 6], som.Color.BLACK, som.Piece.FU)).toBe(false);
    expect(standard.isNeverMovable([1, 1], som.Color.BLACK, som.Piece.FU)).toBe(true);
    expect(standard.isNeverMovable([1, 1], som.Color.BLACK, som.Piece.KY)).toBe(true);
    expect(standard.isNeverMovable([1, 2], som.Color.BLACK, som.Piece.KE)).toBe(true);
  });
});
