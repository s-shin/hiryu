import { Reducer } from "redux";
import produce from "immer";
import * as som from "@hiryu/shogi-object-model";
import { EngineManagerAction } from "../actions/engine_manager";
import EngineManagerActionType from "../constants/EngineManagerActionType";
import { EnginePhase, EngineState, LogLevel } from "../state";
import { newAnalysisResult } from "../utils/game";

const initialState: EngineState = {
  phase: EnginePhase.INIT,
  log: [],
  analysisResults: {},
};

const engine: Reducer<EngineState, EngineManagerAction> = (state = initialState, action) => {
  switch (action.type) {
    case EngineManagerActionType.NEW_ENGINE_REQUEST: {
      return {
        ...state,
        phase: EnginePhase.SETTING_UP_ENGINE,
        engineId: action.engineId,
      };
    }
    case EngineManagerActionType.NEW_ENGINE_SUCCESS: {
      return {
        ...state,
        phase: EnginePhase.CONFIGURATION,
        engineInfo: action.engineInfo,
      };
    }
    case EngineManagerActionType.SET_OPTION_REQUEST: {
      return state;
    }
    case EngineManagerActionType.NEW_GAME_REQUEST: {
      return {
        ...state,
        phase: EnginePhase.PREPARING_GAME,
      };
    }
    case EngineManagerActionType.NEW_GAME_SUCCESS: {
      return {
        ...state,
        phase: EnginePhase.SET_GAME_STATE,
      };
    }
    case EngineManagerActionType.SET_GAME_STATE_REQUEST: {
      return {
        ...state,
        analyzedGameNode: action.gameNode,
      };
    }
    case EngineManagerActionType.GO_REQUEST: {
      return {
        ...state,
        phase: EnginePhase.GOING,
      };
    }
    case EngineManagerActionType.STOP_REQUEST: {
      return state;
    }
    case EngineManagerActionType.BESTMOVE: {
      return {
        ...state,
        phase: EnginePhase.SET_GAME_STATE,
        bestmove: action.bestmove,
      };
    }
    case EngineManagerActionType.INFO: {
      const { info } = action;
      if (!info.multipv || !info.pv) {
        return state;
      }
      const gameNode = state.analyzedGameNode!;
      const move = som.formats.usi.parseMove(info.pv[0]);
      if (!move) {
        // TODO: error handling
        return state;
      }
      const subRoot = som.rules.standard.applyEvent(gameNode, {
        type: som.EventType.MOVE,
        color: gameNode.state.nextTurn,
        ...move,
      });
      subRoot.parent = undefined;
      // TODO: rest of moves
      const newResult = {
        rawInfo: info,
        gameNode: subRoot,
      };
      return produce(state, s => {
        const result = s.analysisResults[s.analyzedGameNode!.id] || newAnalysisResult();
        const idx = result.variations.findIndex(v => v.rawInfo.multipv === info.multipv);
        if (idx >= 0) {
          result.variations[idx] = newResult;
        } else {
          result.variations.push(newResult);
        }
        s.analysisResults[s.analyzedGameNode!.id] = result;
      });
    }
    case EngineManagerActionType.EXIT: {
      return {
        ...state,
        phase: EnginePhase.INIT,
      };
    }
    case EngineManagerActionType.DEBUG: {
      return {
        ...state,
        log: [...state.log, { level: LogLevel.DEBUG, date: new Date(), message: action.message }],
      };
    }
    case EngineManagerActionType.FATAL_ERROR: {
      return {
        ...state,
        phase: EnginePhase.INIT,
        error: action.reason,
        log: [
          ...state.log,
          { level: LogLevel.ERROR, date: new Date(), message: action.reason.message },
        ],
      };
    }
  }
  return state;
};

export default engine;
