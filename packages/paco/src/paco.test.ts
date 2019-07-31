import {
  many,
  char,
  StringReader,
  string,
  not,
  seq,
  join,
  charRange,
  transform,
  lazy,
  oneOf,
  desc,
  charIn,
  execute,
} from "./index";
import { json } from "./json";
import { many1 } from "@hiryu/paco/src/paco";

describe("paco", () => {
  const reader = new StringReader("foo\nbar");

  test("StringReader", () => {
    const rd = reader.clone();
    expect(rd.getCurrentCursor()).toEqual({ line: 1, column: 0 });
    expect(rd.readChar()).toBe("f");
    expect(rd.getCurrentCursor()).toEqual({ line: 1, column: 1 });
    expect(rd.readChar()).toBe("o");
    expect(rd.getCurrentCursor()).toEqual({ line: 1, column: 2 });
    expect(rd.readChar()).toBe("o");
    expect(rd.getCurrentCursor()).toEqual({ line: 1, column: 3 });
    expect(rd.readChar()).toBe("\n");
    expect(rd.getCurrentCursor()).toEqual({ line: 2, column: 0 });
    expect(rd.readChar()).toBe("b");
    expect(rd.getCurrentCursor()).toEqual({ line: 2, column: 1 });
    expect(rd.readChar()).toBe("a");
    expect(rd.getCurrentCursor()).toEqual({ line: 2, column: 2 });
    expect(rd.readChar()).toBe("r");
    expect(rd.getCurrentCursor()).toEqual({ line: 2, column: 3 });
  });

  test("oneOf", () => {
    const fo = oneOf(char("f"), char("o"));
    const r = execute(fo, reader);
    expect(r.value).toBe("f");
  });

  test("char", () => {
    {
      const r = execute(char("f"), reader);
      expect(r.value).toBe("f");
      expect(r.error).toBeUndefined();
    }
    {
      const r = execute(char("o"), reader);
      expect(r.value).toBeUndefined();
      expect(r.error).not.toBeUndefined();
    }
    {
      const fo = charIn("fo");
      const r = execute(fo, reader);
      expect(r.value).toBe("f");
      const r2 = execute(fo, r.reader);
      expect(r2.value).toBe("o");
    }
  });

  test("seq", () => {
    const r = execute(seq(char("f"), seq(char("o"), char("o"))), reader);
    expect(r.value).toEqual(["f", ["o", "o"]]);
    expect(r.error).toBeUndefined();
  });

  test("string", () => {
    {
      const r = execute(string("foo\n"), reader);
      expect(r.value).toBe("foo\n");
      expect(r.error).toBeUndefined();
    }
    {
      const r = execute(string("oo\n"), reader);
      expect(r.value).toBeUndefined();
      expect(r.error).not.toBeUndefined();
    }
    {
      // Unicode characters constructed by multiple code points should be parsed by string parser.
      const rd = new StringReader("🍣👨‍👩‍👧‍👦");
      const r1 = execute(string("🍣"), rd);
      expect(r1.value).toBe("🍣");
      const r2 = execute(string("👨‍👩‍👧‍👦"), r1.reader);
      expect(r2.value).toBe("👨‍👩‍👧‍👦");
    }
  });

  test("many", () => {
    const rd = new StringReader("aaa");
    {
      const r = execute(many(char("a")), rd);
      expect(r.value).toEqual(["a", "a", "a"]);
      expect(r.error).toBeUndefined();
    }
    {
      const r = execute(many(char("a"), { max: 2 }), rd);
      expect(r.value).toEqual(["a", "a"]);
      expect(r.error).toBeUndefined();
    }
    {
      const r = execute(many(char("a"), { min: 3 }), rd);
      expect(r.value).toEqual(["a", "a", "a"]);
      expect(r.error).toBeUndefined();
    }
    {
      const r = execute(many(char("a"), { min: 4 }), rd);
      expect(r.value).toBeUndefined();
      expect(r.error).not.toBeUndefined();
    }
  });

  test("not", () => {
    const r = execute(join(many1(not(string("bar")))), reader);
    expect(r.value).toBe("foo\n");
  });

  test("join", () => {
    const r = execute(join(seq(char("f"), join(many(char("o"))))), reader);
    expect(r.value).toBe("foo");
    expect(r.error).toBeUndefined();
  });

  describe("calc", () => {
    const num = desc(transform(charRange("0", "9"), s => Number(s)), "num", () => "[0-9]");

    test("simple add", () => {
      const add = transform(seq(num, char("+"), num), x => x[0] + x[2]);
      const rd = new StringReader("1+2");
      const r = execute(add, rd);
      expect(r.value).toBe(3);
    });

    test("recursive add", () => {
      const add = lazy<number>();
      add.parser = oneOf(transform(seq(num, char("+"), desc(add, "add")), x => x[0] + x[2]), num);
      const rd = new StringReader("1+2+3");
      const r = execute(add, rd);
      expect(r.value).toBe(6);
    });
  });

  test("json", () => {
    const sample = {
      foo: 100,
      bar: ["200"],
    };
    const rd = new StringReader(JSON.stringify(sample));
    const r = execute(json, rd);
    expect(r.value).toEqual(sample);
  });
});
