import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import * as som from "@hiryu/shogi-object-model";
import { leafGameNode } from "./foo";

function Hand(props: { hand: som.Hand, color: som.Color }) {
  const els = [];
  const pieces = [som.Piece.FU, som.Piece.KY, som.Piece.KE, som.Piece.KI, som.Piece.KA, som.Piece.HI];
  for (const p of pieces) {
    const n = som.getNumPieces(props.hand, p);
    els.push(<div key={p}>{p} {n}</div>);
  }
  return (
    <div>
      <h4>{props.color}</h4>
      {els}
    </div>
  )
}

function Board(props: { board: som.Board }) {
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

function Game(props: { game: som.rules.standard.GameNode }) {
  const Container = styled.div`
    display: flex;
  `;
  const Column = styled.div`
    margin: 1rem;
  `;
  return (
    <Container>
      <Column>
        <Hand hand={som.getHand(props.game.state.hands, som.Color.WHITE)} color={som.Color.WHITE} />
      </Column>
      <Column>
        <Board board={props.game.state.board} />
      </Column>
      <Column>
        <Hand hand={som.getHand(props.game.state.hands, som.Color.BLACK)} color={som.Color.BLACK} />
      </Column>
    </Container>
  )
}

{
  ReactDOM.render(
    <div>
      <Game game={leafGameNode} />
    </div>,
    document.querySelector("main"),
  );
}
