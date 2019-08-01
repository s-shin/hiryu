"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("boardgame.io/core");
const som = __importStar(require("@hiryu/shogi-object-model"));
const tree = __importStar(require("@hiryu/tree"));
const Shogi = core_1.Game({
    setup: () => ({ gameNode: som.rules.standard.newRootGameNode() }),
    moves: {
        applyMoveEvent(G, ctx, e) {
            const next = som.rules.standard.applyEvent(G.gameNode, e);
            if (next.violations.length > 0) {
                console.log({ msg: "illegal move", gameNode: next });
                return G;
            }
            return { gameNode: tree.newRootNode(next) };
        },
    },
    flow: {
        endTurnIf(G, ctx) {
            const c2p = (c) => c === som.Color.BLACK ? "0" : "1";
            const data = tree.getValue(G.gameNode);
            return c2p(data.state.nextTurn) !== ctx.currentPlayer;
        },
    },
});
exports.default = Shogi;
//# sourceMappingURL=Shogi.js.map