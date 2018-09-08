import { newDefaultReadLine } from "./ReadLine";

describe("ReadLine", () => {
  test("basic", () => {
    const rl = newDefaultReadLine();

    expect(rl("foo")).toEqual([]);
    expect(rl("bar\nfizz")).toEqual(["foobar"]);
    expect(rl("buzz\n")).toEqual(["fizzbuzz"]);
  });
});
