"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_shogi_object_model_1 = require("@hiryu/react-shogi-object-model");
class ShogiView extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (react_1.default.createElement(react_shogi_object_model_1.InteractableGame, { gameNode: this.props.G.gameNode, onMoveEvent: e => this.props.moves.applyMoveEvent(e) }));
    }
}
exports.default = ShogiView;
//# sourceMappingURL=ShogiView.js.map