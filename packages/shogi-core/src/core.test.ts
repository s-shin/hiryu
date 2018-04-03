import * as core from "./core";

describe("State", () => {
  test("#preset", () => {
    expect(core.State.preset(core.Handicap.NONE).nextTurn).toBe(core.Color.BLACK);
    expect(core.State.preset(core.Handicap.KY).nextTurn).toBe(core.Color.WHITE);
  });

  test("#toSFEN", () => {
    expect(core.State.preset(core.Handicap.NONE).toSFEN()).toBe("sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1");
  });
});
