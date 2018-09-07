import * as usi from "@hiryu/usi";
import { APIBase, ServiceProvider } from "./service";

export interface API extends APIBase {
  // getEngineList(): Promise<string[]>;
  // setupEngine(engine: string): Promise<void>;

  newGame(): Promise<void>;
  setGameState(state: string, moves: string): Promise<void>;
  go(options: usi.GoOptions): Promise<void>;
  stop(): Promise<void>;

  on(type: "info", cb: (info: usi.Info) => void): void;
  on(type: "bestmove", cb: (move: usi.BestMove) => void): void;
  on(name: "error", cb: (err: Error) => void): void;

  off(name: "info", cb: (info: usi.Info) => void): void;
  off(name: "bestmove", cb: (move: usi.BestMove) => void): void;
  off(name: "error", cb: (err: Error) => void): void;
}

export const provider = new ServiceProvider<API>();
