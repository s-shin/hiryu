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
const styled_components_1 = __importStar(require("styled-components"));
const som = __importStar(require("@hiryu/shogi-object-model"));
const Piece = styled_components_1.default("div") `
  ${props => props.isActive && styled_components_1.css `
    color: red;
  `}
`;
function Hand(props) {
    const els = [];
    const pieces = [som.Piece.FU, som.Piece.KY, som.Piece.KE, som.Piece.GI, som.Piece.KI, som.Piece.KA, som.Piece.HI];
    for (const p of pieces) {
        const n = som.getNumPieces(props.hand, p);
        const isActive = props.activePiece === p;
        els.push(react_1.default.createElement(Piece, { key: p, isActive: isActive, onClick: e => { e.stopPropagation(); props.onClickPiece(p); } },
            som.formats.general.stringifyPiece(p),
            " ",
            n));
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h4", null, som.formats.general.stringifyColor(props.color)),
        els));
}
exports.Hand = Hand;
exports.default = Hand;
//# sourceMappingURL=Hand.js.map