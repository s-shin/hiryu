import GameActionType from "../constants/GameActionType";
import * as som from "@hiryu/shogi-object-model";

export interface SetCurrentGameNodeAction {
  type: GameActionType.SET_CURRENT_GAME_NODE;
  gameNode: som.rules.standard.GameNode;
}

export type GameAction = SetCurrentGameNodeAction;

export const setCurrentGameNode = (gameNode: som.rules.standard.GameNode) => {
  return {
    type: GameActionType.SET_CURRENT_GAME_NODE,
    gameNode,
  };
};
