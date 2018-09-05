"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
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
const Table = styled_components_1.default.table `
  border-collapse: collapse;
`;
const Cell = styled_components_1.default.td `
  position: relative;
  border: 1px solid;
  padding: 0;
`;
const BasicSquare = styled_components_1.default.div `
  width: 1.6em;
  height: 1.8em;
  line-height: 1.8em;
  text-align: center;
  user-select: none;
`;
const BoardSquare = styled_components_1.default((_a) => {
    var { isActive, color } = _a, rest = __rest(_a, ["isActive", "color"]);
    return react_1.default.createElement(BasicSquare, Object.assign({}, rest));
}) `
  ${props => props.color === som.Color.WHITE && styled_components_1.css `
    transform: rotate(180deg);
  `}
  ${props => props.isActive && styled_components_1.css `
    color: red;
  `}
`;
const PromotionSelectorView = styled_components_1.default("div") `
  position: absolute;
  top: -1px;
  left: -50%;
  z-index: 1;
  display: flex;
  background-color: lightgray;
  border: 1px solid;

  > :first-child {
    border-right: 1px solid;
  }
`;
function Board(props) {
    const rows = [];
    for (const y of som.SQUARE_NUMBERS) {
        const cols = [];
        for (const x of som.SQUARE_NUMBERS_DESC) {
            const cp = som.getBoardSquare(props.board, [x, y]);
            const isActive = props.activeSquare !== undefined && som.squareEquals(props.activeSquare, [x, y]);
            cols.push(react_1.default.createElement(Cell, { key: `${x}${y}` },
                react_1.default.createElement(BoardSquare, { isActive: isActive, color: cp && cp.color || undefined, onClick: e => { e.stopPropagation(); props.onClickSquare([x, y]); } }, cp ? som.formats.general.stringifyPiece(cp.piece).replace("王", "玉") : ""),
                props.promotionSelector && som.squareEquals(props.promotionSelector.dstSquare, [x, y]) && (react_1.default.createElement(PromotionSelectorView, { square: [x, y] },
                    react_1.default.createElement(BasicSquare, { onClick: e => { e.stopPropagation(); props.promotionSelector.onSelect(true); } }, som.formats.general.stringifyPiece(som.promote(props.promotionSelector.piece))),
                    react_1.default.createElement(BasicSquare, { onClick: e => { e.stopPropagation(); props.promotionSelector.onSelect(false); } }, som.formats.general.stringifyPiece(props.promotionSelector.piece))))));
        }
        rows.push(react_1.default.createElement("tr", { key: `${y}` }, cols));
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Table, null,
            react_1.default.createElement("tbody", null, rows))));
}
exports.Board = Board;
exports.default = Board;
//# sourceMappingURL=Board.js.map