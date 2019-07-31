"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("boardgame.io/react");
const Shogi_1 = __importDefault(require("./Shogi"));
const ShogiView_1 = __importDefault(require("./ShogiView"));
const App = react_1.Client({
    game: Shogi_1.default,
    board: ShogiView_1.default,
});
exports.default = App;
//# sourceMappingURL=App.js.map