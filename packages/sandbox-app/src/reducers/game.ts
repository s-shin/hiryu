import { Reducer } from "redux";
import * as som from "@hiryu/shogi-object-model";
import GameActionType from "../constants/GameActionType";
import { GameState } from "../state";
import { GameAction } from "../actions/game";
import { newRootGameNode } from "../utils/game";
import { InfoAction } from "../actions/engine_manager";
import EngineManagerActionType from "../constants/EngineManagerActionType";

const initialState: GameState = {
  currentGameNode: newRootGameNode(),
  analysisResults: {},
};

const game: Reducer<GameState, GameAction | InfoAction> = (state = initialState, action) => {
  switch (action.type) {
    case GameActionType.SET_CURRENT_GAME_NODE: {
      return {
        ...state,
        currentGameNode: action.gameNode,
      };
    }
    case EngineManagerActionType.INFO: {
      const { info } = action;
      if (!info.multipv) {
        return state;
      }
      return {
        ...state,
        analysisResults: {
          ...state.analysisResults,
          // TODO: currentGameNode might be changed.
          [state.currentGameNode.id]: {
            ...state.analysisResults[state.currentGameNode.id],
            [info.multipv]: info,
          },
        },
      };
    }
  }
  return state;
};

export default game;
