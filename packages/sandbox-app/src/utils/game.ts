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

// aliases
//! @deprecate
export type GameNode = som.rules.standard.GameNode;
//! @deprecate
export const newRootGameNode = som.rules.standard.newRootGameNode;
//! @deprecate
export const applyEvent = som.rules.standard.applyEvent;
