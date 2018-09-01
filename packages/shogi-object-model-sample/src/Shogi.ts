import { Game } from "boardgame.io/core";
import * as som from "@hiryu/shogi-object-model";
import * as gameHelper from "./helpers/game";

export type GameState = gameHelper.Game;

const Shogi = Game({
  setup: () => gameHelper.newGame(),

  moves: {
    move(G: GameState, ctx: any, from: som.Square, to: som.Square, promote = false) {
      const g = gameHelper.move(G, from, to, promote);
      if (g.current.violations.length > 0) {
        console.log(g);
        return G;
      }
      g.current.parent = undefined;  // TODO: tmp
      return g;
    },
    drop(G: GameState, ctx: any, piece: som.Piece, to: som.Square) {
      const g = gameHelper.drop(G, piece, to);
      g.current.parent = undefined;  // TODO: tmp
      return g;
    },
  },
});

export default Shogi;
