import * as core from "./core";
import * as standardRule from "./standard-rule";

describe("standardRule", () => {
  test("reduce", () => {
    const game = standardRule.Game.preset(core.Handicap.NONE);
    const actual = standardRule.reducer(
      game,
      new core.CSAMoveEvent({
        color: core.Color.BLACK,
        from: core.Position.from(7, 7),
        to: core.Position.from(7, 6),
        piece: core.Piece.FU,
      }),
    );
    const expected = game.update("state", state => (
      state.withMutations(mutState => {
        mutState.update("board", x => x.set([7, 6], core.ColorPiece.black(core.Piece.FU)).delete([7, 7]));
        mutState.set("nextTurn", core.Color.WHITE);
        mutState.set("moveNum", 1);
      })
    ));
    expect(actual).toEqual(expected);
  });

  test("GameManager", () => {
    const gm = new standardRule.GameManager();
    expect(core.RecordFork.MAINSTREAM).toBe(gm.currentForkIndex);
    let state = core.State.preset(core.Handicap.NONE);
    expect(state).toEqual(gm.currentGame.state);
    expect(gm.move([7, 7], [7, 6], core.Piece.FU)).toBe(true);
    state = state.withMutations(mutState => {
      mutState.update("board", x => x.set([7, 6], core.ColorPiece.black(core.Piece.FU)).delete([7, 7]));
      mutState.set("nextTurn", core.Color.WHITE);
      mutState.set("moveNum", 1);
    });
    expect(state).toEqual(gm.currentGame.state);

    console.log({ sfen: gm.toUSIPositionAndMoves() });
  });
});
