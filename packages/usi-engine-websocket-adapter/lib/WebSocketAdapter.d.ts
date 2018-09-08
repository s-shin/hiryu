import { EngineAdapter } from "@hiryu/usi-engine";
export interface WebSocketAdapterOptions {
    url?: string;
    protocols?: string | string[];
    hooks?: {
        onMessage?: (text: string) => string;
        onReadLine?: (line: string) => string;
        onWriteLine?: (line: string) => string;
    };
}
export declare const DEFAULT_URL = "ws://127.0.0.1:3001";
export default class WebSocketAdapter extends EngineAdapter {
    private opts;
    ws?: WebSocket;
    constructor(opts?: WebSocketAdapterOptions);
    start(): void;
    writeln(line: string): void;
    exit(): void;
}
