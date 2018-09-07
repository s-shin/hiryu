import { Module } from "vuex";
import * as usi from "@hiryu/usi";
import { AnalysisState, RootState } from "../interfaces";
import * as usiEngineService from "../../services/usi_engine";
import { Task } from "../../entities/task";

const mod: Module<AnalysisState, RootState> = {
  namespaced: true,
  state: {
    serviceSetupTask: new Task(),
    engineSetupTask: new Task(),
    goTask: new Task(),
    result: [],
    log: [],
  },
  actions: {
    async setupService({ dispatch, commit, state }) {
      const svc = usiEngineService.provider.use();
      if (!state.serviceSetupTask.isSucceeded()) {
        commit("beginServiceSetupTask");
        await svc.initialize();
        svc.on("info", info => {
          commit("onNewInfo", info);
        });
        svc.on("bestmove", move => {
          commit("endGoTask");
        });
        commit("endServiceSetupTask");
      }
      if (!state.engineSetupTask.isSucceeded()) {
        commit("beginEngineSetupTask");
        await svc.newGame();
        commit("endEngineSetupTask");
      }
    },
    async analyze({ dispatch, commit, state }, positionState: string) {
      if (state.goTask.isRunning()) {
        return;
      }
      commit("resetResults"); // TODO: remove
      commit("beginGoTask");
      const svc = usiEngineService.provider.use();
      await svc.setGameState(positionState, "");
      await svc.go(usi.DEFAULT_GO_OPTIONS);
    },
  },
  mutations: {
    beginServiceSetupTask(state) {
      state.serviceSetupTask.begin();
    },
    endServiceSetupTask(state, err?: Error) {
      state.serviceSetupTask.end(err);
    },
    beginEngineSetupTask(state) {
      state.engineSetupTask.begin();
    },
    endEngineSetupTask(state, err?: Error) {
      state.engineSetupTask.end();
    },
    beginGoTask(state) {
      state.goTask.reset().begin();
    },
    endGoTask(state, err?: Error) {
      state.goTask.end(err);
    },
    resetResults(state) {
      state.result = [];
    },
    onNewInfo(state, info: usi.Info) {
      console.log(info);
      if (info.string) {
        state.log.push(info.string);
      }
      if (info.pv) {
        const priority = info.multipv || 1;
        const r = state.result.find(x => x.priority === priority);
        if (r) {
          r.score = info.cp;
          r.mate = info.mate;
          r.moves = info.pv;
        } else {
          state.result.push({
            priority,
            score: info.cp,
            mate: info.mate,
            moves: info.pv,
          });
        }
      }
    },
  },
};

export default mod;
