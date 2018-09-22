import React from "react";
import styled, { css } from "styled-components";
import * as som from "@hiryu/shogi-object-model";
import { PromotionSelectorProps } from "./entities";

const Table = styled.table`
  border-collapse: collapse;
`

const Cell = styled.td`
  position: relative;
  border: 1px solid;
  padding: 0;
`

const BasicSquare = styled.div`
  width: 1.6em;
  height: 1.8em;
  line-height: 1.8em;
  text-align: center;
  user-select: none;
`

const BoardSquare = styled<
  { isActive: boolean, color?: som.Color } & React.HTMLAttributes<HTMLDivElement>
>(({ isActive, color, ...rest }) => <BasicSquare {...rest} />)`
  ${props => props.color === som.Color.WHITE && css`
    transform: rotate(180deg);
  `}
  ${props => props.isActive && css`
    color: red;
  `}
`

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
`

export interface BoardProps {
  board: som.Board;
  activeSquare?: som.Square;
  onClickSquare: (sq: som.Square) => void;
  promotionSelector?: PromotionSelectorProps;
}

export function Board(props: BoardProps) {
  const rows = [];
  for (const y of som.SQUARE_NUMBERS) {
    const cols = [];
    for (const x of som.SQUARE_NUMBERS_DESC) {
      const cp = som.getBoardSquare(props.board, [x, y]);
      const isActive = props.activeSquare !== undefined && som.squareEquals(props.activeSquare, [x, y]);
      cols.push(
        <Cell key={`${x}${y}`}>
          <BoardSquare
            isActive={isActive}
            color={cp && cp.color || undefined}
            onClick={e => { e.stopPropagation(); props.onClickSquare([x, y]) }}
          >
            {cp ? som.formats.ja.stringifyPiece(cp.piece).replace("王", "玉") : ""}
          </BoardSquare>
          {props.promotionSelector && som.squareEquals(props.promotionSelector.dstSquare, [x, y]) && (
            <PromotionSelectorView square={[x, y]}>
              <BasicSquare onClick={e => { e.stopPropagation(); props.promotionSelector!.onSelect(true) }}>
                {som.formats.ja.stringifyPiece(som.promote(props.promotionSelector.piece)!)}
              </BasicSquare>
              <BasicSquare onClick={e => { e.stopPropagation(); props.promotionSelector!.onSelect(false) }}>
                {som.formats.ja.stringifyPiece(props.promotionSelector.piece)}
              </BasicSquare>
            </PromotionSelectorView>
          )}
        </Cell>
      );
    }
    rows.push(<tr key={`${y}`}>{cols}</tr>);
  }

  return (
    <div>
      <Table>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </div>
  )
}

export default Board;
