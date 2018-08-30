import * as som from "../";

describe("standard rule", () => {
  test("applyEvent()", () => {
    const game = som.rules.standard.newRootGameNode();
    const next = som.rules.standard.applyEvent(game, {
      type: som.EventType.MOVE,
      color: som.Color.BLACK,
      srcSquare: [7, 7],
      dstSquare: [7, 6],
    });
    game.children.push(next);
    expect(next.state.nextTurn).toEqual(som.Color.WHITE);
    expect(next.moveNum).toEqual(2);
  });
});
