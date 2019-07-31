import { Game } from "boardgame.io/core";
import * as som from "@hiryu/shogi-object-model";
import { MoveEvent } from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";

export interface GameState {
  gameNode: som.rules.standard.GameNode;
}

const Shogi = Game({
  setup: () => ({ gameNode: som.rules.standard.newRootGameNode() }),

  moves: {
    applyMoveEvent(G: GameState, ctx: any, e: MoveEvent): GameState | null {
      const next = som.rules.standard.applyEvent(G.gameNode, e)
      if (next.violations.length > 0) {
        console.log({ msg: "illegal move", gameNode: next });
        return G;
      }
      return { gameNode: tree.newRootNode(next) };
    },
  },

  flow: {
    endTurnIf(G: GameState, ctx: { currentPlayer: string }) {
      const c2p = (c: som.Color) => c === som.Color.BLACK ? "0" : "1";
      const data = tree.getValue(G.gameNode);
      return c2p(data.state.nextTurn) !== ctx.currentPlayer;
    },
  },
});

export default Shogi;
