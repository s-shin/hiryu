export interface Cursor {
    line: number;
    column: number;
}
export interface Reader {
    clone(): Reader;
    readChar(): string | null;
    getCurrentCursor(): Cursor;
}
export declare class StringReader implements Reader {
    private text;
    private index;
    constructor(text: string);
    clone(): StringReader;
    readChar(): string | null;
    getCurrentCursor(): {
        line: number;
        column: number;
    };
}
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
export declare class BasicParserTracer implements ParserTracer {
    static DEFUALT_OPTIONS: BasicParserTracerOptions;
    opts: BasicParserTracerOptions;
    depth: number;
    constructor(opts?: {
        [key in keyof BasicParserTracerOptions]?: BasicParserTracerOptions[key];
    });
    execute<V>(parser: Parser<V>, reader: Reader): ParseResult<V>;
    fallback<V>(waste: ParseResult<V>): void;
}
export interface ParserStringifyOptions {
    diggable: number;
}
export interface Parser<Value> {
    name: string;
    parse(reader: Reader, tracer: ParserTracer): ParseResult<Value>;
    toString(opts?: ParserStringifyOptions): string;
}
export declare function execute<V>(parser: Parser<V>, reader: Reader, tracer?: ParserTracer): ParseResult<V>;
export declare function digToString<V>(p: Parser<V>, opts?: ParserStringifyOptions): string;
export interface DescDetailsGenerator<V> {
    (p: Parser<V>, opts?: ParserStringifyOptions): string;
}
export declare class DescParser<V> implements Parser<V> {
    parser: Parser<V>;
    name: string;
    details: DescDetailsGenerator<V> | string;
    constructor(parser: Parser<V>, name: string, details?: DescDetailsGenerator<V> | string);
    parse(reader: Reader, tracer: ParserTracer): ParseResult<V>;
    toString(opts?: ParserStringifyOptions): string;
}
export declare const desc: <V>(parser: Parser<V>, name: string, details?: string | DescDetailsGenerator<V>) => DescParser<V>;
export declare class OneOfParser implements Parser<any> {
    ps: Parser<any>[];
    name: string;
    constructor(ps: Parser<any>[]);
    parse(reader: Reader, tracer: ParserTracer): ParseResult<any>;
    toString(opts?: ParserStringifyOptions): string;
}
export interface OneOf {
    <V1, V2>(p1: Parser<V1>, p2: Parser<V2>): Parser<V1 | V2>;
    <V1, V2, V3>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>): Parser<V1 | V2 | V3>;
    <V1, V2, V3, V4>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>): Parser<V1 | V2 | V3 | V4>;
    <V1, V2, V3, V4, V5>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>): Parser<V1 | V2 | V3 | V4 | V5>;
    <V1, V2, V3, V4, V5, V6>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>): Parser<V1 | V2 | V3 | V4 | V5 | V6>;
    <V1, V2, V3, V4, V5, V6, V7>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>): Parser<V1 | V2 | V3 | V4 | V5 | V6 | V7>;
    <V1, V2, V3, V4, V5, V6, V7, V8>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>): Parser<V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8>;
    <V1, V2, V3, V4, V5, V6, V7, V8, V9>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>, p9: Parser<V9>): Parser<V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8 | V9>;
    <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>, p9: Parser<V9>, p10: Parser<V10>): Parser<V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8 | V9 | V10>;
}
export declare const oneOf: OneOf;
export declare class SeqParser implements Parser<any> {
    ps: Parser<any>[];
    name: string;
    constructor(ps: Parser<any>[]);
    parse(reader: Reader, tracer: ParserTracer): ParseResult<any>;
    toString(opts?: ParserStringifyOptions): string;
}
export interface Seq {
    <V1, V2>(p1: Parser<V1>, p2: Parser<V2>): Parser<[V1, V2]>;
    <V1, V2>(p1: Parser<V1>, p2: Parser<V2>): Parser<[V1, V2]>;
    <V1, V2, V3>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>): Parser<[V1, V2, V3]>;
    <V1, V2, V3, V4>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>): Parser<[V1, V2, V3, V4]>;
    <V1, V2, V3, V4, V5>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>): Parser<[V1, V2, V3, V4, V5]>;
    <V1, V2, V3, V4, V5, V6>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>): Parser<[V1, V2, V3, V4, V5, V6]>;
    <V1, V2, V3, V4, V5, V6, V7>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>): Parser<[V1, V2, V3, V4, V5, V6, V7]>;
    <V1, V2, V3, V4, V5, V6, V7, V8>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>): Parser<[V1, V2, V3, V4, V5, V6, V7, V8]>;
    <V1, V2, V3, V4, V5, V6, V7, V8, V9>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>, p9: Parser<V9>): Parser<[V1, V2, V3, V4, V5, V6, V7, V8, V9]>;
    <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(p1: Parser<V1>, p2: Parser<V2>, p3: Parser<V3>, p4: Parser<V4>, p5: Parser<V5>, p6: Parser<V6>, p7: Parser<V7>, p8: Parser<V8>, p9: Parser<V9>, p10: Parser<V10>): Parser<[V1, V2, V3, V4, V5, V6, V7, V8, V9, V10]>;
}
export declare const seq: Seq;
export declare class CharParser implements Parser<string> {
    cond: (c: string) => boolean;
    opts: {
        invert: boolean;
    };
    name: string;
    constructor(cond: (c: string) => boolean, opts?: {
        invert: boolean;
    });
    parse(reader: Reader, tracer: ParserTracer): ParseResult<string>;
    toString(): string;
}
export declare const charIf: (cond: (c: string) => boolean, opts?: {
    invert: boolean;
}) => CharParser;
export declare const char: (c: string, opts?: {
    invert: boolean;
}) => DescParser<string>;
export declare const charIn: (cs: string, opts?: {
    invert: boolean;
}) => DescParser<string>;
export declare const charRange: (start: string, end: string, opts?: {
    invert: boolean;
}) => DescParser<string>;
export declare const DEFAULT_MANY_OPTIONS: {
    min?: number;
    max?: number;
};
export declare class Many<V> implements Parser<V[]> {
    parser: Parser<V>;
    opts: {
        min?: number | undefined;
        max?: number | undefined;
    };
    name: string;
    constructor(parser: Parser<V>, opts?: {
        min?: number | undefined;
        max?: number | undefined;
    });
    parse(reader: Reader, tracer: ParserTracer): ParseResult<V[]>;
    toString(opts?: ParserStringifyOptions): string;
}
export declare const many: <Value>(p: Parser<Value>, opts?: {
    min?: number | undefined;
    max?: number | undefined;
}) => Many<Value>;
export declare class TransformParser<V1, V2> implements Parser<V2> {
    parser: Parser<V1>;
    transform: (v: V1) => V2;
    name: string;
    constructor(parser: Parser<V1>, transform: (v: V1) => V2);
    parse(reader: Reader, tracer: ParserTracer): ParseResult<V2>;
    toString(opts?: ParserStringifyOptions): string;
}
export declare const transform: <V1, V2>(p: Parser<V1>, fn: (v: V1) => V2) => TransformParser<V1, V2>;
export declare class LazyParser<V> implements Parser<V> {
    name: string;
    parser?: Parser<V>;
    parse(reader: Reader, tracer: ParserTracer): ParseResult<V>;
    toString(opts?: ParserStringifyOptions): string;
}
export declare const lazy: <V>() => LazyParser<V>;
export declare const constant: <V1, V2>(p: Parser<V1>, value: V2) => TransformParser<V1, V2>;
export declare const optional: <Value>(p: Parser<Value>, defVal: Value) => DescParser<Value>;
export declare const join: (p: Parser<string[]>) => TransformParser<string[], string>;
export declare const joinSeq: (...ps: Parser<string>[]) => TransformParser<string[], string>;
export declare const string: (s: string) => TransformParser<string[], string>;
export {};
