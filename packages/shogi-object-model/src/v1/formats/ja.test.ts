import * as jp from "./ja";
import { Piece, Color, EventType } from "../definitions";

describe("ja", () => {
  test("num2kan, kan2num", () => {
    expect(jp.num2kan(0)).toBe("〇");
    expect(jp.num2kan(9)).toBe("九");
    expect(jp.num2kan(10)).toBe("十");
    expect(jp.num2kan(11)).toBe("十一");
    expect(jp.num2kan(99)).toBe("九十九");
    expect(jp.num2kan(100)).toBe(null);

    expect(jp.kan2num("〇")).toBe(0);
    expect(jp.kan2num("九")).toBe(9);
  });

  test("num2zen, zen2num", () => {
    expect(jp.num2zen(0)).toBe("０");
    expect(jp.num2zen(9)).toBe("９");
    expect(jp.num2zen(10)).toBe("１０");
    expect(jp.num2zen(100)).toBe("１００");

    expect(jp.zen2num("０")).toBe(0);
    expect(jp.zen2num("９")).toBe(9);
  });

  test("stringifyPiece, parsePiece", () => {
    expect(jp.stringifyPiece(Piece.NG)).toBe("全");
    expect(jp.parsePiece("角")).toBe(Piece.KA);
  });

  test("stringifySquare, paresSquare", () => {
    expect(jp.stringifySquare([1, 2])).toBe("１二");
    expect(jp.parseSquare("１二")).toEqual([1, 2]);
  });

  test("stringifyMoveEvent", () => {
    expect(
      jp.stringifyMoveEvent({
        type: EventType.MOVE,
        color: Color.BLACK,
        dstSquare: [2, 2],
        sameDstSquare: false,
        srcPiece: Piece.KA,
        promote: true,
      }),
    ).toBe("２二角成");
  });
});
