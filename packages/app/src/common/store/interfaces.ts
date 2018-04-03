import { Set } from "immutable";
import * as core from "@hiryu/shogi-core";
import * as usi from "@hiryu/usi";
import { Task } from "../entities/task";
import { GameObject } from "../entities/game_object";

export interface AppState {
  fileLoadTask: Task;
  gameManager: core.standardRule.GameManager | null;
  selectedGameObject: GameObject | null;
  moveCandidates: Set<core.standardRule.MoveCandidate>;
}

export interface AnalysisResult {
  priority: number;
  score?: usi.ScoreInfo;
  mate?: usi.MateInfo;
  moves: string[];
}

export interface AnalysisState {
  serviceSetupTask: Task;
  engineSetupTask: Task;
  goTask: Task;
  result: AnalysisResult[];
  log: string[];
}

export interface RootState {
  app: AppState;
  analysis: AnalysisState;
}
