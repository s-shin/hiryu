import * as som from "@hiryu/shogi-object-model";
import { Info } from "@hiryu/usi-engine";

export interface AnalysisResult {
  [multipv: number]: Info;
}

export function getBestResult(result: AnalysisResult): Info | null {
  for (const idx of Object.keys(result)
    .map(i => Number(i))
    .sort()) {
    return result[idx];
  }
  return null;
}

export interface GameNodeData {
  analysisResult: AnalysisResult;
}

export type GameNode = som.rules.standard.GameNode<GameNodeData>;

export function newRootGameNode(): GameNode {
  return {
    ...som.rules.standard.newRootGameNode(),
    data: {
      analysisResult: {},
    },
  };
}

export function applyEvent(node: GameNode, e: som.Event): GameNode {
  return {
    ...som.rules.standard.applyEvent(node, e),
    data: {
      analysisResult: {},
    },
  };
}
