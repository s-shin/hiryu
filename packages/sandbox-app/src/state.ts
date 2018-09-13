import { EngineInfo } from "@hiryu/usi-engine";

export enum EnginePhase {
  NONE,
  SETTING_UP_ENGINE,
  CONFIGURATION,
  PREPARING_GAME,
  SET_GAME_STATE,
  GOING,
}

export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
}

export interface LogEntry {
  level: LogLevel;
  date: Date;
  message: string;
}

export interface EngineState {
  phase: EnginePhase;
  engineId?: number;
  engineInfo?: EngineInfo;
  bestmove?: string;
  error?: Error;
  log: LogEntry[];
}

export interface RootState {
  engine: EngineState;
}
