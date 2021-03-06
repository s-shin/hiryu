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
const Table = styled_1.default.table `
  border-collapse: collapse;
`;
const Cell = styled_1.default.td `
  position: relative;
  border: 1px solid;
  padding: 0;
`;
const basicSquareStyle = core_1.css `
  width: 1.6em;
  height: 1.8em;
  line-height: 1.8em;
  text-align: center;
  user-select: none;
`;
const BasicSquare = styled_1.default.div `
  ${basicSquareStyle}
`;
const squareStyles = {
    selected: core_1.css `
    color: red;
  `,
    lastMovedTo: core_1.css `
    font-weight: bold;
  `,
};
const BoardSquare = styled_1.default.div `
  ${basicSquareStyle};
  ${props => props.css};
  ${props => props.rotate &&
    core_1.css `
      transform: rotate(180deg);
    `};
`;
const PromotionSelectorView = styled_1.default.div `
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
exports.Board = props => {
    const { highlight } = props;
    const rows = [];
    for (const y of som.SQUARE_NUMBERS) {
        const cols = [];
        for (const x of som.SQUARE_NUMBERS_DESC) {
            const cp = som.getBoardSquare(props.board, [x, y]);
            const squareStyle = (() => {
                if (highlight.selected && som.squareEquals(highlight.selected, [x, y])) {
                    return squareStyles.selected;
                }
                if (highlight.lastMovedTo && som.squareEquals(highlight.lastMovedTo, [x, y])) {
                    return squareStyles.lastMovedTo;
                }
            })();
            cols.push(react_1.default.createElement(Cell, { key: `${x}${y}` },
                react_1.default.createElement(BoardSquare, { css: squareStyle, rotate: !!cp && cp.color === som.Color.WHITE, onClick: e => {
                        e.stopPropagation();
                        props.onClickSquare([x, y]);
                    } }, cp ? som.formats.ja.stringifyPiece(cp.piece).replace("王", "玉") : ""),
                props.promotionSelector && som.squareEquals(props.promotionSelector.dstSquare, [x, y]) && (react_1.default.createElement(PromotionSelectorView, { square: [x, y] },
                    react_1.default.createElement(BasicSquare, { onClick: e => {
                            e.stopPropagation();
                            props.promotionSelector.onSelect(true);
                        } }, som.formats.ja.stringifyPiece(som.promote(props.promotionSelector.piece))),
                    react_1.default.createElement(BasicSquare, { onClick: e => {
                            e.stopPropagation();
                            props.promotionSelector.onSelect(false);
                        } }, som.formats.ja.stringifyPiece(props.promotionSelector.piece))))));
        }
        rows.push(react_1.default.createElement("tr", { key: `${y}` }, cols));
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Table, null,
            react_1.default.createElement("tbody", null, rows))));
};
exports.default = exports.Board;
//# sourceMappingURL=Board.js.map