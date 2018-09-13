import { Reducer } from "redux";
import { EngineManagerAction } from "../actions/engine_manager";
import EngineManagerActionType from "../constants/EngineManagerActionType";
import { EnginePhase, EngineState, LogLevel } from "../state";

const initialState: EngineState = {
  phase: EnginePhase.NONE,
  log: [],
};

const engine: Reducer<EngineState, EngineManagerAction> = (state = initialState, action) => {
  switch (action.type) {
    case EngineManagerActionType.NEW_ENGINE_REQUEST: {
      return {
        ...initialState,
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
      return state;
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
      return {
        ...state,
        // infoLog: [...state.infoLog, action.info],
      };
    }
    case EngineManagerActionType.EXIT: {
      return state;
      // return initialState;
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
        error: action.reason,
        log: [...state.log, { level: LogLevel.ERROR, date: new Date(), message: action.reason.message }],
      };
    }
  }
  return state;
};

export default engine;
