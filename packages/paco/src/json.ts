import {
  desc,
  charIn,
  charIf,
  many,
  seq,
  charRange,
  string,
  join,
  joinSeq,
  oneOf,
  char,
  optional,
  transform,
  lazy,
  constant,
} from "./paco";

const ws = desc(many(charIn(" \t\r\n")), "ws");

const sign = charIn("+-");

const onenine = charRange("1", "9");

const digit = charRange("0", "9");

const digits = join(many(digit));

const int = joinSeq(optional(sign, ""), oneOf(char("0"), joinSeq(onenine, digits)));

const flac = joinSeq(char("."), digits);

const exp = joinSeq(charIn("Ee"), sign, digits);

const number = desc(
  transform(joinSeq(int, optional(flac, ""), optional(exp, "")), s => Number(s)),
  "number",
);

const hex = oneOf(digit, charRange("a", "f"), charRange("A", "F"));

const escape = oneOf(charIn(`"\\/bnrt`), joinSeq(char("u"), hex, hex, hex, hex));

const character = oneOf(
  joinSeq(char("\\"), escape),
  charIf(c => {
    const cc = c.charCodeAt(0);
    return (
      "\u0020".charCodeAt(0) <= cc && cc <= "\u10ffff".charCodeAt(0) && c !== "\\" && c !== `"`
    );
  }),
);

const str = desc(transform(seq(char(`"`), join(many(character)), char(`"`)), v => v[1]), "string");

type Value = number | string | boolean | null | {} | any[];

const value = desc(lazy<Value>(), "value");

const element = transform(seq(ws, value, ws), v => v[1]);

const elements = desc(lazy<Value[]>(), "elements");

elements.parser = oneOf(
  transform(seq(element, char(","), elements), v => [v[0], ...v[2]]),
  transform(element, v => [v]),
);

const array = desc(
  transform(seq(char("["), oneOf(elements, constant(ws, Array<Value>())), char("]")), v => v[1]),
  "array",
);

const member = transform(seq(ws, str, ws, char(":"), element), v => ({ [v[1]]: v[4] }));

const members = desc(lazy<{ [key: string]: Value }>(), "members");

members.parser = oneOf(
  transform(seq(member, char(","), members), v => ({ ...v[0], ...v[2] })),
  member,
);

const object = desc(
  transform(seq(char("{"), oneOf(members, constant(ws, {})), char("}")), v => v[1]),
  "object",
);

const boolean = desc(transform(oneOf(string("true"), string("false")), v => Boolean(v)), "boolean");

const nil = desc(transform(string("null"), () => null), "null");

value.parser = oneOf(str, number, boolean, nil, object, array);

export const json = element;
