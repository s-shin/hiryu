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
const som = __importStar(require("@hiryu/shogi-object-model"));
const tree = __importStar(require("@hiryu/tree"));
const Game_1 = __importDefault(require("./Game"));
const useGameInteraction_1 = __importDefault(require("./useGameInteraction"));
function InteractableGame(props) {
    const interaction = useGameInteraction_1.default(props);
    const data = tree.getValue(props.gameNode);
    return (react_1.default.createElement(Game_1.default, { state: data.state, activeGameObject: interaction.activeGameObject, promotionSelector: interaction.promotionSelector, onClickGameObject: obj => interaction.updateActiveGameObject(obj), lastMovedTo: (data.byEvent && data.byEvent.type == som.EventType.MOVE && data.byEvent.dstSquare) ||
            undefined }));
}
exports.default = InteractableGame;
//# sourceMappingURL=InteractableGame.js.map