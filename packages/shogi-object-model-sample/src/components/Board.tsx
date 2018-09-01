import React from "react";
import styled, { css } from "styled-components";
import * as som from "@hiryu/shogi-object-model";

const Square = styled<{ isActive: boolean }, 'td'>('td')`
  ${props => props.isActive && css`
    color: red;
  `}
`

export interface BoardProps {
  board: som.Board;
  activeSquare?: som.Square;
  onClickSquare: (sq: som.Square) => void;
}

export function Board(props: BoardProps) {
  const rows = [];
  for (const y of som.SQUARE_NUMBERS) {
    const cols = [];
    for (const x of som.SQUARE_NUMBERS_DESC) {
      const cp = som.getBoardSquare(props.board, [x, y]);
      const isActive = props.activeSquare !== undefined && som.squareEquals(props.activeSquare, [x, y]);
      cols.push(
        <Square
          key={`${x}${y}`}
          isActive={isActive}
          onClick={e => { e.stopPropagation(); props.onClickSquare([x, y]) }}
        >
          {cp ? `${cp.color === som.Color.BLACK ? "+" : "-"}${cp.piece}` : "."}
        </Square>);
    }
    rows.push(<tr key={`${y}`}>{cols}</tr>);
  }

  return (
    <div>
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

export default Board;
