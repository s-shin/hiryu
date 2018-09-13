import { ActionCreator, Dispatch } from "redux";
import { Engine, EngineInfo, GoOptions, Info } from "@hiryu/usi-engine";
import { ThunkDispatch } from "redux-thunk";
import WebSocketAdapter, { WebSocketAdapterOptions } from "@hiryu/usi-engine-websocket-adapter";
import EngineManagerActionType from "../constants/EngineManagerActionType";

let lastEngineId = 0;

interface Entry {
  id: number;
  engine: Engine;
}

const engines = new Map<number, Entry>();

function mustGet(id: number) {
  const entry = engines.get(id);
  if (!entry) {
    throw new Error("assert: entry not found: " + id);
  }
  return entry;
}

//---

export interface NewEngineRequestAction {
  type: EngineManagerActionType.NEW_ENGINE_REQUEST;
  engineId: number;
}

export interface NewEngineSuccessAction {
  type: EngineManagerActionType.NEW_ENGINE_SUCCESS;
  engineId: number;
  engineInfo: EngineInfo;
}

export interface SetOptionRequestAction {
  type: EngineManagerActionType.SET_OPTION_REQUEST;
  engineId: number;
}

export interface NewGameRequestAction {
  type: EngineManagerActionType.NEW_GAME_REQUEST;
  engineId: number;
}

export interface NewGameSuccessAction {
  type: EngineManagerActionType.NEW_GAME_SUCCESS;
  engineId: number;
}

export interface SetGameStateRequestAction {
  type: EngineManagerActionType.SET_GAME_STATE_REQUEST;
  engineId: number;
}

export interface GoRequestAction {
  type: EngineManagerActionType.GO_REQUEST;
  engineId: number;
}

export interface StopRequestAction {
  type: EngineManagerActionType.STOP_REQUEST;
  engineId: number;
}

export interface BestmoveAction {
  type: EngineManagerActionType.BESTMOVE;
  engineId: number;
  bestmove: string;
}

export interface InfoAction {
  type: EngineManagerActionType.INFO;
  engineId: number;
  info: Info;
}

export interface ExitAction {
  type: EngineManagerActionType.EXIT;
  engineId: number;
}

export interface DebugAction {
  type: EngineManagerActionType.DEBUG;
  engineId: number;
  message: string;
  args: any[];
}

export interface FatalErrorAction {
  type: EngineManagerActionType.FATAL_ERROR;
  engineId: number;
  reason: Error;
}

export type EngineManagerAction =
  | NewEngineRequestAction
  | NewEngineSuccessAction
  | SetOptionRequestAction
  | NewGameRequestAction
  | NewGameSuccessAction
  | SetGameStateRequestAction
  | GoRequestAction
  | StopRequestAction
  | BestmoveAction
  | InfoAction
  | ExitAction
  | DebugAction
  | FatalErrorAction;

//---

export const newEngine = (url: string) => (
  dispatch: Dispatch<
    | NewEngineRequestAction
    | NewEngineSuccessAction
    | NewGameSuccessAction
    | BestmoveAction
    | InfoAction
    | ExitAction
    | DebugAction
    | FatalErrorAction
  >,
) => {
  const engineId = ++lastEngineId;

  dispatch({
    type: EngineManagerActionType.NEW_ENGINE_REQUEST,
    engineId,
  });

  let engine: Engine | null = new Engine(
    new WebSocketAdapter({
      url,
      hooks: {
        onMessage: s => `${s}\n`,
        onWriteLine: line => line,
      },
    }),
  );

  engines.set(engineId, { id: engineId, engine });

  engine.on("debug", (message, ...args) => {
    dispatch({
      type: EngineManagerActionType.DEBUG,
      engineId,
      message,
      args,
    });
  });

  engine.on("error", e => {
    dispatch({
      type: EngineManagerActionType.FATAL_ERROR,
      engineId,
      reason: e,
    });
  });

  engine.on("configure", () => {
    dispatch({
      type: EngineManagerActionType.NEW_ENGINE_SUCCESS,
      engineId,
      engineInfo: engine!.info,
    });
  });

  engine.on("ready", () => {
    dispatch({
      type: EngineManagerActionType.NEW_GAME_SUCCESS,
      engineId,
    });
  });

  engine.on("bestmove", move => {
    dispatch({
      type: EngineManagerActionType.BESTMOVE,
      engineId,
      bestmove: move,
    });
  });

  engine.on("info", info => {
    dispatch({
      type: EngineManagerActionType.INFO,
      engineId,
      info,
    });
  });

  engine.on("exit", () => {
    dispatch({
      type: EngineManagerActionType.EXIT,
      engineId,
    });
    engine = null;
    engines.delete(engineId);
  });

  engine.start();
};

//---

export const setOption = (engineId: number, name: string, value: string): SetOptionRequestAction => {
  mustGet(engineId).engine.setOption(name, value);
  return { type: EngineManagerActionType.SET_OPTION_REQUEST, engineId };
};

//---

export const newGame = (engineId: number): NewGameRequestAction => {
  mustGet(engineId).engine.newGame();
  return { type: EngineManagerActionType.NEW_GAME_REQUEST, engineId };
};

//---

export const setGameState = (engineId: number, state: string, moves = ""): SetGameStateRequestAction => {
  mustGet(engineId).engine.setGameState(state, moves);
  return { type: EngineManagerActionType.SET_GAME_STATE_REQUEST, engineId };
};

//---

export const go = (engineId: number, opts?: GoOptions): GoRequestAction => {
  mustGet(engineId).engine.go(opts);
  return { type: EngineManagerActionType.GO_REQUEST, engineId };
};

//---

export const stop = (engineId: number): StopRequestAction => {
  mustGet(engineId).engine.stop();
  return { type: EngineManagerActionType.STOP_REQUEST, engineId };
};
