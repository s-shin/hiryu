import * as defs from "../definitions";
import * as usi from "./usi";

describe("usi", () => {
  test("parse/stringifySFEN", () => {
    let sfen: usi.SFEN;
    expect(() => { sfen = usi.getSFEN(defs.Handicap.NONE); }).not.toThrow();
    expect(sfen).toEqual({
      state: defs.HIRATE_STATE,
      nextMoveNum: 1,
    });
    expect(usi.stringifySFEN(sfen)).toEqual(usi.getSFENString(defs.Handicap.NONE));
  });
});
