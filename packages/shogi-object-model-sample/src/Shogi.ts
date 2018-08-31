import { Game } from "boardgame.io/core";
import * as gameHelper from "./helpers/game";

const Shogi = Game({
  setup: () => gameHelper.newGame(),

  moves: {
    //
  },
});

export default Shogi;
