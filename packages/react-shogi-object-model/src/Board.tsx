import React from "react";
import styled, { css, InterpolationValue } from "styled-components";
import * as som from "@hiryu/shogi-object-model";
import { PromotionSelectorProps } from "./entities";

const Table = styled.table`
  border-collapse: collapse;
`;

const Cell = styled.td`
  position: relative;
  border: 1px solid;
  padding: 0;
`;

const BasicSquare = styled.div`
  width: 1.6em;
  height: 1.8em;
  line-height: 1.8em;
  text-align: center;
  user-select: none;
`;

const squareStyles = {
  selected: css`
    color: red;
  `,
  lastMovedTo: css`
    font-weight: bold;
  `,
  // candidate: ...
};

const BoardSquare = styled<
  { css?: InterpolationValue[]; rotate: boolean } & React.HTMLAttributes<HTMLDivElement>
>(props => <BasicSquare {...props} />)`
  ${props =>
    props.rotate &&
    css`
      transform: rotate(180deg);
    `} ${props => props.css};
`;

const PromotionSelectorView = styled<{ square: som.Square }, "div">("div")`
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

export interface BoardProps {
  board: som.Board;
  onClickSquare: (sq: som.Square) => void;
  promotionSelector?: PromotionSelectorProps;
  highlight: {
    selected?: som.Square;
    lastMovedTo?: som.Square;
  };
}

export function Board(props: BoardProps) {
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
      cols.push(
        <Cell key={`${x}${y}`}>
          <BoardSquare
            css={squareStyle}
            rotate={!!cp && cp.color === som.Color.WHITE}
            onClick={e => {
              e.stopPropagation();
              props.onClickSquare([x, y]);
            }}
          >
            {cp ? som.formats.ja.stringifyPiece(cp.piece).replace("王", "玉") : ""}
          </BoardSquare>
          {props.promotionSelector &&
            som.squareEquals(props.promotionSelector.dstSquare, [x, y]) && (
              <PromotionSelectorView square={[x, y]}>
                <BasicSquare
                  onClick={e => {
                    e.stopPropagation();
                    props.promotionSelector!.onSelect(true);
                  }}
                >
                  {som.formats.ja.stringifyPiece(som.promote(props.promotionSelector.piece)!)}
                </BasicSquare>
                <BasicSquare
                  onClick={e => {
                    e.stopPropagation();
                    props.promotionSelector!.onSelect(false);
                  }}
                >
                  {som.formats.ja.stringifyPiece(props.promotionSelector.piece)}
                </BasicSquare>
              </PromotionSelectorView>
            )}
        </Cell>,
      );
    }
    rows.push(<tr key={`${y}`}>{cols}</tr>);
  }

  return (
    <div>
      <Table>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}

export default Board;
