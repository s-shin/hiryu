import * as general from "./general";
import { Piece } from "../definitions";

describe("general", () => {
  test("parsePiece", () => {
    expect(general.parsePiece("角")).toBe(Piece.KA);
  });
});
