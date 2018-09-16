"use strict";
//------------------------------------------------------------------------------
// Readers
//------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
class StringReader {
    constructor(text) {
        this.text = text;
        this.index = 0;
    }
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
            }
            else {
                c.column++;
            }
        }
        return c;
    }
}
exports.StringReader = StringReader;
class BasicParserTracer {
    constructor(opts) {
        this.opts = BasicParserTracer.DEFUALT_OPTIONS;
        this.depth = 0;
        this.opts = Object.assign({}, this.opts, (opts || {}));
    }
    execute(parser, reader) {
        if (this.opts.level === "none") {
            return parser.parse(reader, this);
        }
        {
            const indent = this.opts.indent.repeat(this.depth);
            const cursor = reader.getCurrentCursor();
            this.opts.log(`${indent}${parser.toString(this.opts.stringify)} [${cursor.line}:${cursor.column}]`);
        }
        this.depth++;
        const r = parser.parse(reader, this);
        {
            const indent = this.opts.indent.repeat(this.depth - 1);
            if (r.error) {
                this.opts.log(`${indent}=> ${parser.name} error: ${r.error.message}`);
            }
            else {
                const cursor = r.reader.getCurrentCursor();
                this.opts.log(`${indent}=> ${parser.name} ok [${cursor.line}:${cursor.column}]`);
            }
        }
        this.depth--;
        return r;
    }
}
BasicParserTracer.DEFUALT_OPTIONS = {
    level: "none",
    indent: "  ",
    stringify: { diggable: 3 },
    log: (...vs) => console.log(...vs),
};
exports.BasicParserTracer = BasicParserTracer;
/**
 * Execute parsing with reader and tracer.
 */
function execute(parser, reader, tracer = new BasicParserTracer()) {
    return tracer.execute(parser, reader);
}
exports.execute = execute;
/**
 * Helper function for calling toString of child parsers.
 */
function digToString(p, opts) {
    const o = Object.assign({ diggable: 0 }, opts);
    if (o.diggable > 0) {
        o.diggable--;
    }
    return o.diggable !== 0 ? p.toString(o) : p.name;
}
exports.digToString = digToString;
class DescParser {
    constructor(parser, name, details = (p, opts) => digToString(p, opts)) {
        this.parser = parser;
        this.name = name;
        this.details = details;
    }
    parse(reader, tracer) {
        return tracer.execute(this.parser, reader);
    }
    toString(opts) {
        const desc = typeof this.details === "function" ? this.details(this.parser, opts) : this.details;
        return [this.name, ...(desc.length === 0 ? [] : [": ", desc])].join("");
    }
}
exports.DescParser = DescParser;
exports.desc = (parser, name, details = (p, opts) => digToString(p, opts)) => new DescParser(parser, name, details);
//---
class OneOfParser {
    constructor(ps) {
        this.ps = ps;
        this.name = "oneOf";
    }
    parse(reader, tracer) {
        const { ps } = this;
        for (const p of ps) {
            const r = tracer.execute(p, reader);
            if (r.error) {
                continue;
            }
            return r;
        }
        return { reader, error: new Error("not matched") };
    }
    toString(opts) {
        return `${this.name}: (${this.ps.map(p => `<${digToString(p, opts)}>`).join("|")})`;
    }
}
exports.OneOfParser = OneOfParser;
const _oneOf = (...ps) => new OneOfParser(ps);
exports.oneOf = _oneOf;
//---
class SeqParser {
    constructor(ps) {
        this.ps = ps;
        this.name = "seq";
    }
    parse(reader, tracer) {
        const { ps } = this;
        const values = Array();
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
    toString(opts) {
        return `${this.name}: ${this.ps.map(p => `<${digToString(p, opts)}>`).join("")}`;
    }
}
exports.SeqParser = SeqParser;
const _seq = (...ps) => new SeqParser(ps);
exports.seq = _seq;
//---
//! Read one character from the reader if specified parser failed to parse it.
class NotParser {
    constructor(parser) {
        this.parser = parser;
        this.name = "not";
    }
    parse(reader, tracer) {
        const rd = reader.clone();
        const r = tracer.execute(this.parser, rd);
        if (r.error) {
            const c = rd.readChar();
            if (c !== null) {
                return { reader: rd, value: c };
            }
        }
        return { reader, error: new Error("no character comsumed") };
    }
    toString(opts) {
        return `${this.name}: [^<${digToString(this.parser, opts)}>]`;
    }
}
exports.NotParser = NotParser;
exports.not = (p) => new NotParser(p);
//---
//! Parse single UTF-16 character.
class CharParser {
    constructor(cond, opts = { invert: false }) {
        this.cond = cond;
        this.opts = opts;
        this.name = "char";
    }
    parse(reader, tracer) {
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
exports.CharParser = CharParser;
const escape = (s) => {
    const t = JSON.stringify(s);
    return t.slice(1, t.length - 1);
};
exports.charIf = (cond, opts = { invert: false }) => new CharParser(cond, opts);
exports.char = (c, opts = { invert: false }) => exports.desc(exports.charIf(rc => rc === c, opts), "char", `[${opts.invert ? "^" : ""}${escape(c)}]`);
//! slow oneline: oneOf(...cs.split("").map(c => char(c, opts))).parse(reader);
exports.charIn = (cs, opts = { invert: false }) => exports.desc(exports.charIf(c => cs.indexOf(c) >= 0, opts), "charIn", `[${opts.invert ? "^" : ""}${escape(cs)}]`);
exports.charRange = (start, end, opts = { invert: false }) => exports.desc(exports.charIf(c => {
    const cc = c.charCodeAt(0);
    return start.charCodeAt(0) <= cc && cc <= end.charCodeAt(0);
}), "charRange", `[${opts.invert ? "^" : ""}${escape(start)}-${escape(end)}]`);
exports.anyChar = exports.charIf(() => true);
//---
class EofParser {
    constructor() {
        this.name = "eof";
    }
    parse(reader, tracer) {
        const rd = reader.clone();
        if (rd.readChar() === null) {
            return { reader, value: null };
        }
        return { reader, error: new Error("not eof") };
    }
    toString(opts) {
        return this.name;
    }
}
exports.EofParser = EofParser;
exports.eof = new EofParser();
//---
exports.DEFAULT_MANY_OPTIONS = { min: 0, max: 1024 * 1024 };
class Many {
    constructor(parser, opts = exports.DEFAULT_MANY_OPTIONS) {
        this.parser = parser;
        this.opts = opts;
        this.name = "many";
        opts.min = opts.min || exports.DEFAULT_MANY_OPTIONS.min;
        opts.max = opts.max || exports.DEFAULT_MANY_OPTIONS.max;
    }
    parse(reader, tracer) {
        const { parser, opts } = this;
        const values = Array();
        let rd = reader;
        let i = 0;
        while (i < opts.max) {
            const r = tracer.execute(parser, rd);
            if (r.error) {
                break;
            }
            values.push(r.value);
            rd = r.reader;
            i++;
        }
        if (i < opts.min) {
            return { reader, error: new Error("against min option") };
        }
        return { reader: rd, value: values };
    }
    toString(opts) {
        const inf = this.opts.max === exports.DEFAULT_MANY_OPTIONS.max;
        let rep;
        if (this.opts.min === 0) {
            rep = inf ? "*" : `{0, ${this.opts.max}}`;
        }
        else if (this.opts.min === 1) {
            rep = inf ? "+" : `{1, ${this.opts.max}}`;
        }
        else {
            rep = inf ? `{${this.opts.min},}` : `{${this.opts.min}, ${this.opts.max}}`;
        }
        return `${this.name}: <${digToString(this.parser, opts)}>${rep}`;
    }
}
exports.Many = Many;
exports.many = (p, opts = exports.DEFAULT_MANY_OPTIONS) => new Many(p, opts);
exports.many1 = (p, max = exports.DEFAULT_MANY_OPTIONS.max) => new Many(p, { min: 1, max });
//---
class TransformParser {
    constructor(parser, transform) {
        this.parser = parser;
        this.transform = transform;
        this.name = "transform";
    }
    parse(reader, tracer) {
        const r = tracer.execute(this.parser, reader);
        if (r.error) {
            return { reader, error: r.error };
        }
        return { reader: r.reader, value: this.transform(r.value) };
    }
    toString(opts) {
        return `${this.name}: (${this.transform.toString()})(${digToString(this.parser, opts)})`;
    }
}
exports.TransformParser = TransformParser;
exports.transform = (p, fn) => new TransformParser(p, fn);
//---
class ValidateParser {
    constructor(parser, cond) {
        this.parser = parser;
        this.cond = cond;
        this.name = "validate";
    }
    parse(reader, tracer) {
        const r = tracer.execute(this.parser, reader);
        if (r.error) {
            return { reader, error: r.error };
        }
        const err = this.cond(r.value);
        if (err) {
            return { reader, error: err };
        }
        return r;
    }
}
exports.ValidateParser = ValidateParser;
exports.validate = (p, cond) => new ValidateParser(p, cond);
//---
class LazyParser {
    constructor() {
        this.name = "lazy";
    }
    parse(reader, tracer) {
        if (!this.parser) {
            throw new Error("parser is undefined");
        }
        return tracer.execute(this.parser, reader);
    }
    toString(opts) {
        return `${this.name}: <${this.parser && digToString(this.parser, opts)}>`;
    }
}
exports.LazyParser = LazyParser;
exports.lazy = () => new LazyParser();
//---
exports.constant = (p, value) => exports.transform(p, () => value);
exports.optional = (p, defVal) => exports.desc(exports.transform(exports.many(p, { max: 1 }), v => (v.length > 0 ? v[0] : defVal)), "optional");
exports.join = (p) => exports.transform(p, ss => ss.join(""));
exports.joinSeq = (...ps) => exports.join(_seq(...ps));
exports.string = (s) => exports.joinSeq(...s.split("").map(c => exports.char(c)));
exports.filter = (p, cond) => exports.transform(p, vs => vs.filter(cond));
function isNotNull(v) {
    return v !== null;
}
exports.filterNull = (p) => exports.filter(p, isNotNull);
//# sourceMappingURL=paco.js.map