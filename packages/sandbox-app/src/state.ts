import * as som from "@hiryu/shogi-object-model";
import { EngineInfo } from "@hiryu/usi-engine";
import { AnalysisResult } from "./utils/game";

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

export interface AnalysisResults {
  [gameNodeId: string]: AnalysisResult;
}

export interface EngineState {
  phase: EnginePhase;
  engineId?: number;
  engineInfo?: EngineInfo;
  analyzedGameNode?: som.rules.standard.GameNode;
  bestmove?: string;
  error?: Error;
  log: LogEntry[];
  analysisResults: AnalysisResults;
}

export interface GameState {
  currentGameNode: som.rules.standard.GameNode;
}

export interface RootState {
  engine: EngineState;
  game: GameState;
}
