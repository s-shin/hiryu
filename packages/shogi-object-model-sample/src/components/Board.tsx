import React from "react";
// import styled from "styled-components";
import * as som from "@hiryu/shogi-object-model";

export interface BoardProps {
  board: som.Board;
}

export function Board(props: BoardProps) {
  const rows = [];
  for (const y of som.SQUARE_NUMBERS) {
    const cols = [];
    for (const x of som.SQUARE_NUMBERS_DESC) {
      const cp = som.getBoardSquare(props.board, [x, y]);
      cols.push(<td key={`${x}${y}`}>{cp ? `${cp.color === som.Color.BLACK ? "+" : "-"}${cp.piece}` : "."}</td>);
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
