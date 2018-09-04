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
const styled_components_1 = __importDefault(require("styled-components"));
const som = __importStar(require("@hiryu/shogi-object-model"));
const Hand_1 = __importDefault(require("./Hand"));
const Board_1 = __importDefault(require("./Board"));
const entities_1 = require("./entities");
const Container = styled_components_1.default.div `
  display: flex;
`;
const Column = styled_components_1.default.div `
  margin: 1rem;
`;
function Game(props) {
    const state = props.state;
    const active = props.activeGameObject;
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Column, null,
            react_1.default.createElement(Hand_1.default, { hand: som.getHand(state.hands, som.Color.WHITE), color: som.Color.WHITE, activePiece: active
                    && active.type === entities_1.GameObjectType.HAND_PIECE
                    && active.color === som.Color.WHITE
                    ? active.piece
                    : undefined, onClickPiece: piece => props.onClickGameObject({ type: entities_1.GameObjectType.HAND_PIECE, color: som.Color.WHITE, piece }) })),
        react_1.default.createElement(Column, null,
            react_1.default.createElement(Board_1.default, { board: state.board, activeSquare: active && active.type === entities_1.GameObjectType.BOARD_SQUARE ? active.square : undefined, promotionSelector: props.promotionSelector, onClickSquare: sq => props.onClickGameObject({ type: entities_1.GameObjectType.BOARD_SQUARE, square: sq }) })),
        react_1.default.createElement(Column, null,
            react_1.default.createElement(Hand_1.default, { hand: som.getHand(state.hands, som.Color.BLACK), color: som.Color.BLACK, activePiece: active
                    && active.type === entities_1.GameObjectType.HAND_PIECE
                    && active.color === som.Color.BLACK
                    ? active.piece
                    : undefined, onClickPiece: piece => props.onClickGameObject({ type: entities_1.GameObjectType.HAND_PIECE, color: som.Color.BLACK, piece }) }))));
}
exports.Game = Game;
exports.default = Game;
//# sourceMappingURL=Game.js.map