import { EngineAdapter } from "@hiryu/usi-engine";
import { newDefaultReadLine } from "./readline";

export interface WebSocketAdapterOptions {
  url?: string;
  protocols?: string | string[];
  hooks?: {
    onMessage?: (text: string) => string,
    onReadLine?: (line: string) => string,
    onWriteLine?: (line: string) => string,
  },
}

function identity<T>(v: T) {
  return v;
}

export const DEFAULT_URL = "ws://127.0.0.1:3001";

export default class WebSocketAdapter extends EngineAdapter {
  ws?: WebSocket;

  constructor(private opts: WebSocketAdapterOptions = {}) {
    super();
  }

  start() {
    if (this.ws) {
      this.onError(new Error("already started"));
      return;
    }
    this.ws = new WebSocket(this.opts.url || DEFAULT_URL, this.opts.protocols);
    const rl = newDefaultReadLine();

    this.ws.onopen = () => {
      this.onReady();
    };

    let wasError = false;
    this.ws.onerror = () => {
      wasError = true;
    };

    this.ws.onmessage = e => {
      const onMessage = this.opts.hooks && this.opts.hooks.onMessage || identity;
      const onReadLine = this.opts.hooks && this.opts.hooks.onReadLine || identity;
      for (const line of rl(onMessage(e.data))) {
        this.onReadLine(onReadLine(line));
      }
    };

    this.ws.onclose = e => {
      if (wasError) {
        this.onError(new Error(`WebSocket error: ${e.code} ${e.reason}`));
      }
      this.onAfterExit();
      this.ws = undefined;
    };
  }

  writeln(line: string) {
    if (!this.ws) {
      this.onError(new Error("not started"));
      return;
    }
    const onWriteLine = this.opts.hooks && this.opts.hooks.onWriteLine || ((s: string) => `${s}\n`);
    this.ws.send(onWriteLine(line));
  }

  exit() {
    if (!this.ws) {
      this.onError(new Error("not stared"));
      return;
    }
    this.onBeforeExit();
    this.ws.close();
  }
}
