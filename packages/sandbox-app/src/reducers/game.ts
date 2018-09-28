import { Reducer } from "redux";
// import * as som from "@hiryu/shogi-object-model";
import GameActionType from "../constants/GameActionType";
import { GameState } from "../state";
import { GameAction } from "../actions/game";
import { newRootGameNode, AnalysisResult } from "../utils/game";

const initialState: GameState = {
  currentGameNode: newRootGameNode(),
};

const game: Reducer<GameState, GameAction> = (state = initialState, action) => {
  switch (action.type) {
    case GameActionType.SET_CURRENT_GAME_NODE: {
      return {
        ...state,
        currentGameNode: action.gameNode,
      };
    }
  }
  return state;
};

export default game;
