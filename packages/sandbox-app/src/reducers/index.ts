import { combineReducers } from "redux";
import engine from "./engine";
import game from "./game";

const reducers = combineReducers({
  engine,
  game,
});

export default reducers;
