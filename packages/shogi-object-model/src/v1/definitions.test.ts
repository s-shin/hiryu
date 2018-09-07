import { squareToBoardIndex } from "./definitions";

describe("definitions", () => {
  test("squareToBoardIndex()", () => {
    expect(squareToBoardIndex([9, 1])).toEqual(0);
    expect(squareToBoardIndex([1, 9])).toEqual(80);
  });
});