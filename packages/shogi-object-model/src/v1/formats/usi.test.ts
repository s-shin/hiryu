import * as defs from "../definitions";
import * as usi from "./usi";

describe("usi", () => {
  test("stringifySquare", () => {
    expect(usi.stringifySquare([7, 7])).toBe("7g");
  });

  test("stringifyMove, parseMove", () => {
    expect(
      usi.stringifyMove({
        srcSquare: [7, 7],
        dstSquare: [7, 6],
        srcPiece: defs.Piece.FU,
        promote: false,
      }),
    ).toBe("7g7f");

    expect(
      usi.stringifyMove({
        dstSquare: [5, 5],
        srcPiece: defs.Piece.KA,
      }),
    ).toBe("B*5e");

    expect(usi.parseMove("3c3d")).toEqual({
      srcSquare: [3, 3],
      dstSquare: [3, 4],
      srcPiece: undefined,
      promote: undefined,
    });

    expect(usi.parseMove("R*2a")).toEqual({
      srcSquare: undefined,
      dstSquare: [2, 1],
      srcPiece: defs.Piece.HI,
      promote: undefined,
    });
  });

  test("parse/stringifySFEN", () => {
    let sfen: usi.SFEN;
    expect(() => {
      sfen = usi.getSFEN(defs.Handicap.NONE);
    }).not.toThrow();
    expect(sfen).toEqual({
      state: defs.HIRATE_STATE,
      nextMoveNum: 1,
    });
    expect(usi.stringifySFEN(sfen)).toEqual(usi.getSFENString(defs.Handicap.NONE));
  });
});
