import { Record } from "../definitions";
export declare function detectEncoding(data: Uint8Array): "utf-8" | "sjis";
export declare const recordParser: import("@hiryu/paco").DescParser<Record>;
export declare function parseRecord(data: string, log?: (msg: string) => void): Error | Record;
