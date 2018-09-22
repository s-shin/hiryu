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
const styled_components_1 = __importStar(require("./styled-components"));
const som = __importStar(require("@hiryu/shogi-object-model"));
const HandContainer = styled_components_1.default.div `
  user-select: none;
`;
const HandHeader = styled_components_1.default.h4 `
  margin: 0 0 0.2em 0;
  font-size: 1em;
`;
const HandPiece = styled_components_1.default("div") `
  line-height: 1;
  writing-mode: vertical-rl;
  margin-bottom: 0.1em;
  ${props => props.isActive && styled_components_1.css `
    color: red;
  `}
`;
const PieceCharacter = styled_components_1.default.span ``;
function Hand(props) {
    const els = [];
    const pieces = [som.Piece.FU, som.Piece.KY, som.Piece.KE, som.Piece.GI, som.Piece.KI, som.Piece.KA, som.Piece.HI];
    for (const p of pieces) {
        const n = som.getNumPieces(props.hand, p);
        if (n === 0) {
            continue;
        }
        const isActive = props.activePiece === p;
        els.push(react_1.default.createElement(HandPiece, { key: `${p}-${n}`, isActive: isActive, onClick: e => { e.stopPropagation(); props.onClickPiece(p); } },
            react_1.default.createElement(PieceCharacter, null,
                som.formats.ja.stringifyPiece(p),
                n > 1 ? som.formats.ja.num2kan(n) : "")));
    }
    return (react_1.default.createElement(HandContainer, null,
        react_1.default.createElement(HandHeader, null, som.formats.ja.stringifyColor(props.color)),
        els));
}
exports.Hand = Hand;
exports.default = Hand;
//# sourceMappingURL=Hand.js.map