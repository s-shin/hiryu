import React from "react";
import styled, { css } from "styled-components";
import * as som from "@hiryu/shogi-object-model";

const Piece = styled<{ isActive: boolean }, "div">("div")`
  ${props => props.isActive && css`
    color: red;
  `}
`

export interface HandProps {
  hand: som.Hand,
  color: som.Color,
  activePiece?: som.Piece,
  onClickPiece: (piece: som.Piece) => void;
}

export function Hand(props: HandProps) {
  const els = [];
  const pieces = [som.Piece.FU, som.Piece.KY, som.Piece.KE, som.Piece.KI, som.Piece.KA, som.Piece.HI];
  for (const p of pieces) {
    const n = som.getNumPieces(props.hand, p);
    const isActive = props.activePiece === p;
    els.push(<Piece key={p} isActive={isActive} onClick={e => { e.stopPropagation(); props.onClickPiece(p) }}>{p} {n}</Piece>);
  }
  return (
    <div>
      <h4>{props.color}</h4>
      {els}
    </div>
  )
}

export default Hand;
