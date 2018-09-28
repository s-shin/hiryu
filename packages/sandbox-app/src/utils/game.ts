import * as som from "@hiryu/shogi-object-model";
import { Info } from "@hiryu/usi-engine";

export interface Variation {
  rawInfo: Info;
  //! root node of subtree corresponding to pv
  gameNode: som.rules.standard.GameNode;
}

export interface AnalysisResult {
  variations: Variation[];
}

export function newAnalysisResult(): AnalysisResult {
  return { variations: [] };
}

// aliases
//! @deprecate
export type GameNode = som.rules.standard.GameNode;
//! @deprecate
export const newRootGameNode = som.rules.standard.newRootGameNode;
//! @deprecate
export const applyEvent = som.rules.standard.applyEvent;
