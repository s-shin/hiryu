import * as som from "@hiryu/shogi-object-model";
import { Info } from "@hiryu/usi-engine";

export interface Variation {
  rawInfo: Info;
  startGameNode: som.rules.standard.GameNode;
}

export interface AnalysisResult {
  variations: Variation[];
}

export function newAnalysisResult(): AnalysisResult {
  return { variations: [] };
}
