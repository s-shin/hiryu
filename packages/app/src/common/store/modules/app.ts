import { Set } from "immutable";
import { Module } from "vuex";
import { AppState, RootState } from "../interfaces";
import * as core from "@hiryu/shogi-core";
import * as shogiUtil from "../../utils/shogi";
import JKFPlayer, { JSONKifuFormat } from "json-kifu-format";
import { Task } from "../../entities/task";
import * as gameObj from "../../entities/game_object";

const mod: Module<AppState, RootState> = {
  namespaced: true,
  state: {
    fileLoadTask: new Task(),
    gameManager: null,
    selectedGameObject: null,
    moveCandidates: Set(),
  },
  actions: {
    async newGameByURL({ commit }, url: string) {
      commit("beginFileLoad");
      try {
        const res = await fetch(url);
        const data = await res.json();
        // TODO: validate data
        commit("newGameByJKF", data);
        commit("endFileLoad");
      } catch (e) {
        commit("endFileLoad", e);
      }
    },
    async newGameByFile({ commit }, file: File) {
      commit("beginFileLoad");
      try {
        const reader = new FileReader();
        reader.readAsText(file);
        await new Promise((resolve, reject) => {
          reader.onerror = e => reject(e);
          reader.onloadend = () => resolve();
        });
        const jkfPlayer = JKFPlayer.parse(reader.result);
        commit("newGameByJKF", jkfPlayer.kifu);
        commit("endFileLoad");
      } catch (e) {
        commit("endFileLoad", e);
      }
    },
  },
  mutations: {
    beginFileLoad(state) {
      state.fileLoadTask.reset().begin();
    },
    endFileLoad(state, error?: Error) {
      state.fileLoadTask.end(error);
    },
    newGame(state) {
      state.gameManager = new core.standardRule.GameManager();
      state.gameManager.start();
    },
    newGameByJKF(state, jkf: JSONKifuFormat) {
      const record = shogiUtil.toBasicGameRecord(jkf);
      const gm = new core.standardRule.GameManager(record);
      state.gameManager = gm;
    },
    goto(state, notationIdx: number) {
      if (!state.gameManager) {
        return;
      }
      state.gameManager.goto(notationIdx);
    },
    selectGameObject(state, obj: gameObj.GameObject) {
      const gm = state.gameManager;
      if (!gm) {
        throw new Error("assert");
      }
      if (obj.equals(state.selectedGameObject)) {
        state.moveCandidates = Set();
        state.selectedGameObject = null;
        return;
      }
      const gs = gm.currentGame.state;
      switch (obj.type) {
        case gameObj.GameObjectType.BOARD_SQUARE: {
          const cp = gs.board.get(obj.pos);
          if (cp === null || !gs.nextTurn.equals(cp.color)) {
            state.selectedGameObject = null;
            return;
          }
          state.moveCandidates = core.standardRule.getMoveCandidates(gs.board, obj.pos);
          state.selectedGameObject = obj;
          return;
        }
        case gameObj.GameObjectType.HAND_PIECE: {
          if (!obj.color.equals(gs.nextTurn)) {
            state.selectedGameObject = null;
            return;
          }
          state.moveCandidates = core.standardRule.getDropCandidates(gs.board, obj.color, obj.piece);
          state.selectedGameObject = obj;
          return;
        }
      }
    },
    unselectGameObject(state) {
      state.moveCandidates = Set();
      state.selectedGameObject = null;
    },
    move(state, moveCandidate: core.standardRule.MoveCandidate) {
      const gm = state.gameManager;
      if (!gm) {
        throw new Error("assert");
      }
      const obj = state.selectedGameObject;
      if (!obj) {
        throw new Error("assert");
      }
      switch (obj.type) {
        case gameObj.GameObjectType.BOARD_SQUARE: {
          if (!gm.move(obj.pos, moveCandidate.to, moveCandidate.piece)) {
            console.log("TODO: error");
          }
          break;
        }
        case gameObj.GameObjectType.HAND_PIECE: {
          if (!gm.drop(moveCandidate.to, moveCandidate.piece)) {
            console.log("TODO: error");
          }
          break;
        }
      }
      state.moveCandidates = Set();
      state.selectedGameObject = null;
    },
  },
};

export default mod;
