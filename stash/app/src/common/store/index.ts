import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./interfaces";
import app from "./modules/app";
import analysis from "./modules/analysis";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store<RootState>({
  modules: {
    app,
    analysis,
  },
  strict: debug,
});
