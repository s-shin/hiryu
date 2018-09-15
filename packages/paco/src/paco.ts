//------------------------------------------------------------------------------
// Readers
//------------------------------------------------------------------------------

export interface Cursor {
  line: number;
  column: number;
}

export interface Reader {
  clone(): Reader;
  readChar(): string | null;
  getCurrentCursor(): Cursor;
}

export class StringReader implements Reader {
  private index = 0;

  constructor(private text: string) {}

  clone() {
    const r = new StringReader(this.text);
    r.index = this.index;
    return r;
  }

  readChar() {
    if (this.index >= this.text.length) {
      return null;
    }
    const s = this.text[this.index++];
    if (this.index > this.text.length) {
      this.index = this.text.length;
    }
    return s;
  }

  getCurrentCursor() {
    const c = { line: 1, column: 0 };
    for (let i = 0; i < this.index; i++) {
      if (this.text[i] === "\n") {
        c.line++;
        c.column = 0;
      } else {
        c.column++;
      }
    }
    return c;
  }
}

//------------------------------------------------------------------------------
// Parsers
//------------------------------------------------------------------------------

export interface ParseResult<Value> {
  reader: Reader;
  value?: Value;
  error?: Error;
}

export interface ParserTracer {
  execute<V>(parser: Parser<V>, reader: Reader): ParseResult<V>;
  fallback<V>(waste: ParseResult<V>): void;
}

interface BasicParserTracerOptions {
  level: "none" | "verbose";
  indent: string;
  stringify: ParserStringifyOptions;
  log: (...vs: any[]) => void;
}

export class BasicParserTracer implements ParserTracer {
  static DEFUALT_OPTIONS: BasicParserTracerOptions = {
    level: "none",
    indent: "  ",
    stringify: { diggable: 3 },
    log: (...vs: any[]) => console.log(...vs),
  };

  opts = BasicParserTracer.DEFUALT_OPTIONS;
  depth = 0;

  constructor(opts?: { [key in keyof BasicParserTracerOptions]?: BasicParserTracerOptions[key] }) {
    this.opts = { ...this.opts, ...(opts || {}) };
  }

  execute<V>(parser: Parser<V>, reader: Reader): ParseResult<V> {
    if (this.opts.level === "none") {
      return parser.parse(reader, this);
    }
    {
      const indent = this.opts.indent.repeat(this.depth);
      const cursor = reader.getCurrentCursor();
      this.opts.log(
        `${indent}${parser.toString(this.opts.stringify)} [${cursor.line}:${cursor.column}]`,
      );
    }
    this.depth++;
    const r = parser.parse(reader, this);
    {
      const indent = this.opts.indent.repeat(this.depth - 1);
      if (r.error) {
        this.opts.log(`${indent}=> ${parser.name} error: ${r.error.message}`);
      } else {
        const cursor = r.reader.getCurrentCursor();
        this.opts.log(`${indent}=> ${parser.name} ok [${cursor.line}:${cursor.column}]`);
      }
    }
    this.depth--;
    return r;
  }

  fallback<V>(waste: ParseResult<V>) {
    if (this.opts.level === "none") {
      return;
    }
    const indent = this.opts.indent.repeat(this.depth);
    this.opts.log(`${indent}# fallback (error: ${waste.error && waste.error.message})`);
  }
}

export interface ParserStringifyOptions {
  diggable: number;
}

export interface Parser<Value> {
  name: string;
  parse(reader: Reader, tracer: ParserTracer): ParseResult<Value>;
  toString(opts?: ParserStringifyOptions): string;
}

export function execute<V>(
  parser: Parser<V>,
  reader: Reader,
  tracer: ParserTracer = new BasicParserTracer(),
) {
  return tracer.execute(parser, reader);
}

export function digToString<V>(p: Parser<V>, opts?: ParserStringifyOptions) {
  const o = { diggable: 0, ...opts };
  if (o.diggable > 0) {
    o.diggable--;
  }
  return o.diggable !== 0 ? p.toString(o) : p.name;
}

//---

export interface DescDetailsGenerator<V> {
  (p: Parser<V>, opts?: ParserStringifyOptions): string;
}

export class DescParser<V> implements Parser<V> {
  constructor(
    public parser: Parser<V>,
    public name: string,
    public details: DescDetailsGenerator<V> | string = (p, opts) => digToString(p, opts),
  ) {}

  parse(reader: Reader, tracer: ParserTracer): ParseResult<V> {
    return tracer.execute(this.parser, reader);
  }

  toString(opts?: ParserStringifyOptions) {
    const desc =
      typeof this.details === "function" ? this.details(this.parser, opts) : this.details;
    return [this.name, ...(desc.length === 0 ? [] : [": ", desc])].join("");
  }
}

export const desc = <V>(
  parser: Parser<V>,
  name: string,
  details: DescDetailsGenerator<V> | string = (p, opts) => digToString(p, opts),
) => new DescParser(parser, name, details);

//---

export class OneOfParser implements Parser<any> {
  name = "oneOf";

  constructor(public ps: Parser<any>[]) {}

  parse(reader: Reader, tracer: ParserTracer): ParseResult<any> {
    const { ps } = this;
    for (const p of ps) {
      const r = tracer.execute(p, reader);
      if (r.error) {
        tracer.fallback(r);
        continue;
      }
      return r;
    }
    return { reader, error: new Error("not matched") };
  }

  toString(opts?: ParserStringifyOptions) {
    return `${this.name}: (${this.ps.map(p => `<${digToString(p, opts)}>`).join("|")})`;
  }
}

/*
for i in {2..10}; do
  vs=""
  for j in $(seq 1 $i); do
    if (($j > 1)); then vs+=", "; fi
    vs+="V${j}"
  done
  ps=""
  for j in $(seq 1 $i); do
    if (($j > 1)); then ps+=", "; fi
    ps+="p${j}: Parser<V${j}>"
  done
  rvs=""
  for j in $(seq 1 $i); do
    if (($j > 1)); then rvs+=" | "; fi
    rvs+="V${j}"
  done
  echo "  <${vs}>(${ps}): Parser<${rvs}>"
done
*/

// prettier-ignore
export interface OneOf {
  <V1, V2>(p1: Parser<V1>, p2: Parser<V2>): Parser<V1 | V2>
  <V1, V2, V3>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>): Parser<V1 | V2 | V3>
  <V1, V2, V3, V4>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>): Parser<V1 | V2 | V3 | V4>
  <V1, V2, V3, V4, V5>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>): Parser<V1 | V2 | V3 | V4 | V5>
  <V1, V2, V3, V4, V5, V6>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>): Parser<V1 | V2 | V3 | V4 | V5 | V6>
  <V1, V2, V3, V4, V5, V6, V7>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>): Parser<V1 | V2 | V3 | V4 | V5 | V6 | V7>
  <V1, V2, V3, V4, V5, V6, V7, V8>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>): Parser<V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>, p9: Parser<V9>): Parser<V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8 | V9>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>, p9: Parser<V9>, p10: Parser<V10>): Parser<V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8 | V9 | V10>
}

const _oneOf = (...ps: Parser<any>[]) => new OneOfParser(ps);

export const oneOf: OneOf = _oneOf;

//---

export class SeqParser implements Parser<any> {
  name = "seq";

  constructor(public ps: Parser<any>[]) {}

  parse(reader: Reader, tracer: ParserTracer): ParseResult<any> {
    const { ps } = this;
    const values = Array<any>();
    let rd = reader;
    for (const p of ps) {
      const r = tracer.execute(p, rd);
      if (r.error) {
        return { reader, error: r.error };
      }
      values.push(r.value);
      rd = r.reader;
    }
    return { reader: rd, value: values };
  }

  toString(opts?: ParserStringifyOptions) {
    return `${this.name}: ${this.ps.map(p => `<${digToString(p, opts)}>`).join("")}`;
  }
}

/*
for i in {2..10}; do
  vs=""
  for j in $(seq 1 $i); do
    if (($j > 1)); then vs+=", "; fi
    vs+="V${j}"
  done
  ps=""
  for j in $(seq 1 $i); do
    if (($j > 1)); then ps+=", "; fi
    ps+="p${j}: Parser<V${j}>"
  done
  echo "  <${vs}>(${ps}): Parser<[${vs}]>"
done
*/

// prettier-ignore
export interface Seq {
  <V1, V2>(p1: Parser<V1>, p2: Parser<V2>): Parser<[V1, V2]>
  <V1, V2>(p1: Parser<V1>, p2: Parser<V2>): Parser<[V1, V2]>
  <V1, V2, V3>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>): Parser<[V1, V2, V3]>
  <V1, V2, V3, V4>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>): Parser<[V1, V2, V3, V4]>
  <V1, V2, V3, V4, V5>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>): Parser<[V1, V2, V3, V4, V5]>
  <V1, V2, V3, V4, V5, V6>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>): Parser<[V1, V2, V3, V4, V5, V6]>
  <V1, V2, V3, V4, V5, V6, V7>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>): Parser<[V1, V2, V3, V4, V5, V6, V7]>
  <V1, V2, V3, V4, V5, V6, V7, V8>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>): Parser<[V1, V2, V3, V4, V5, V6, V7, V8]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>, p9: Parser<V9>): Parser<[V1, V2, V3, V4, V5, V6, V7, V8, V9]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>, p9: Parser<V9>, p10: Parser<V10>): Parser<[V1, V2, V3, V4, V5, V6, V7, V8, V9, V10]>
}

const _seq = (...ps: Parser<any>[]) => new SeqParser(ps);

export const seq: Seq = _seq;

//---

//! Parse single UTF-16 character.
export class CharParser implements Parser<string> {
  name = "char";

  constructor(public cond: (c: string) => boolean, public opts = { invert: false }) {}

  parse(reader: Reader, tracer: ParserTracer): ParseResult<string> {
    const { cond, opts } = this;
    const rd = reader.clone();
    const c = rd.readChar();
    if (c === null) {
      return { reader, error: new Error("EOF") };
    }
    const ok = cond(c);
    if (opts.invert ? ok : !ok) {
      return { reader, error: new Error("not matched") };
    }
    return { reader: rd, value: c };
  }

  toString() {
    return `${this.name}: ${this.opts.invert ? "!" : ""}(${this.cond.toString()})`;
  }
}

const escape = (s: string) => {
  const t = JSON.stringify(s);
  return t.slice(1, t.length - 1);
};

export const charIf = (cond: (c: string) => boolean, opts = { invert: false }) =>
  new CharParser(cond, opts);

export const char = (c: string, opts = { invert: false }) =>
  desc(charIf(rc => rc === c, opts), "char", `[${opts.invert ? "^" : ""}${escape(c)}]`);

//! slow oneline: oneOf(...cs.split("").map(c => char(c, opts))).parse(reader);
export const charIn = (cs: string, opts = { invert: false }) =>
  desc(charIf(c => cs.indexOf(c) >= 0, opts), "charIn", `[${opts.invert ? "^" : ""}${escape(cs)}]`);

export const charRange = (start: string, end: string, opts = { invert: false }) =>
  desc(
    charIf(c => {
      const cc = c.charCodeAt(0);
      return start.charCodeAt(0) <= cc && cc <= end.charCodeAt(0);
    }),
    "charRange",
    `[${opts.invert ? "^" : ""}${escape(start)}-${escape(end)}]`,
  );

//---

export const DEFAULT_MANY_OPTIONS: {
  min?: number;
  max?: number;
} = { min: 0, max: 1024 * 1024 };

export class Many<V> implements Parser<V[]> {
  name = "many";

  constructor(public parser: Parser<V>, public opts = DEFAULT_MANY_OPTIONS) {
    opts.min = opts.min || DEFAULT_MANY_OPTIONS.min;
    opts.max = opts.max || DEFAULT_MANY_OPTIONS.max;
  }

  parse(reader: Reader, tracer: ParserTracer): ParseResult<V[]> {
    const { parser, opts } = this;
    const values = Array<V>();
    let rd = reader;
    let i = 0;
    while (i < opts.max!) {
      const r = tracer.execute(parser, rd);
      if (r.error) {
        break;
      }
      values.push(r.value!);
      rd = r.reader;
      i++;
    }
    if (i < opts.min!) {
      return { reader, error: new Error("against min option") };
    }
    return { reader: rd, value: values };
  }

  toString(opts?: ParserStringifyOptions) {
    const inf = this.opts.max === DEFAULT_MANY_OPTIONS.max;
    let rep;
    if (this.opts.min === 0) {
      rep = inf ? "*" : `{0, ${this.opts.max}}`;
    } else if (this.opts.min === 1) {
      rep = inf ? "+" : `{1, ${this.opts.max}}`;
    } else {
      rep = inf ? `{${this.opts.min},}` : `{${this.opts.min}, ${this.opts.max}}`;
    }
    return `${this.name}: <${digToString(this.parser, opts)}>${rep}`;
  }
}

export const many = <Value>(p: Parser<Value>, opts = DEFAULT_MANY_OPTIONS) => new Many(p, opts);

//---

export class TransformParser<V1, V2> implements Parser<V2> {
  name = "transform";

  constructor(public parser: Parser<V1>, public transform: (v: V1) => V2) {}

  parse(reader: Reader, tracer: ParserTracer): ParseResult<V2> {
    const r = tracer.execute(this.parser, reader);
    if (r.error) {
      return { reader, error: r.error };
    }
    return { reader: r.reader, value: this.transform(r.value!) };
  }

  toString(opts?: ParserStringifyOptions) {
    return `${this.name}: (${this.transform.toString()})(${digToString(this.parser, opts)})`;
  }
}

export const transform = <V1, V2>(p: Parser<V1>, fn: (v: V1) => V2) => new TransformParser(p, fn);

//---

export class LazyParser<V> implements Parser<V> {
  name = "lazy";

  public parser?: Parser<V>;

  parse(reader: Reader, tracer: ParserTracer): ParseResult<V> {
    if (!this.parser) {
      throw new Error("parser is undefined");
    }
    return tracer.execute(this.parser, reader);
  }

  toString(opts?: ParserStringifyOptions) {
    return `${this.name}: <${this.parser && digToString(this.parser, opts)}>`;
  }
}

export const lazy = <V>() => new LazyParser<V>();

//---

export const constant = <V1, V2>(p: Parser<V1>, value: V2) => transform(p, () => value);

export const optional = <Value>(p: Parser<Value>, defVal: Value) =>
  desc(transform(many(p, { max: 1 }), v => (v.length > 0 ? v[0] : defVal)), "optional");

export const join = (p: Parser<string[]>) => transform(p, ss => ss.join(""));

export const joinSeq = (...ps: Parser<string>[]) => join(_seq(...ps));

export const string = (s: string) => joinSeq(...s.split("").map(c => char(c)));
