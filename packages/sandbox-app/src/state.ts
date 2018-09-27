import { EngineInfo } from "@hiryu/usi-engine";
import { GameNode, AnalysisResult } from "./utils/game";

export enum EnginePhase {
  INIT,
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

export interface AnalysisResults {
  [gameNodeId: string]: AnalysisResult;
}

export interface GameState {
  currentGameNode: GameNode;
  analysisResults: AnalysisResults;
}

export interface RootState {
  engine: EngineState;
  game: GameState;
}
