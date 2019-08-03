"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const core_1 = require("@emotion/core");
const styled_1 = __importDefault(require("@emotion/styled"));
const som = __importStar(require("@hiryu/shogi-object-model"));
const Hand_1 = __importDefault(require("./Hand"));
const Board_1 = __importDefault(require("./Board"));
const entities_1 = require("./entities");
const Container = styled_1.default.div `
  display: flex;
`;
const HandColumn = styled_1.default.div `
  ${props => props.color === som.Color.WHITE &&
    core_1.css `
      transform: rotate(180deg);
    `};
`;
const BoardColumn = styled_1.default.div `
  margin: 0 0.5em;
`;
exports.Game = props => {
    const state = props.state;
    const active = props.activeGameObject;
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(HandColumn, { color: som.Color.WHITE },
            react_1.default.createElement(Hand_1.default, { hand: som.getHand(state.hands, som.Color.WHITE), color: som.Color.WHITE, activePiece: active && active.type === entities_1.GameObjectType.HAND_PIECE && active.color === som.Color.WHITE
                    ? active.piece
                    : undefined, onClickPiece: piece => props.onClickGameObject({
                    type: entities_1.GameObjectType.HAND_PIECE,
                    color: som.Color.WHITE,
                    piece,
                }) })),
        react_1.default.createElement(BoardColumn, null,
            react_1.default.createElement(Board_1.default, { board: state.board, highlight: {
                    selected: active && active.type === entities_1.GameObjectType.BOARD_SQUARE ? active.square : undefined,
                    lastMovedTo: props.lastMovedTo,
                }, promotionSelector: props.promotionSelector, onClickSquare: sq => props.onClickGameObject({ type: entities_1.GameObjectType.BOARD_SQUARE, square: sq }) })),
        react_1.default.createElement(HandColumn, null,
            react_1.default.createElement(Hand_1.default, { hand: som.getHand(state.hands, som.Color.BLACK), color: som.Color.BLACK, activePiece: active && active.type === entities_1.GameObjectType.HAND_PIECE && active.color === som.Color.BLACK
                    ? active.piece
                    : undefined, onClickPiece: piece => props.onClickGameObject({
                    type: entities_1.GameObjectType.HAND_PIECE,
                    color: som.Color.BLACK,
                    piece,
                }) }))));
};
exports.default = exports.Game;
//# sourceMappingURL=Game.js.map