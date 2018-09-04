import React from "react";
import styled, { css } from "./styled-components";
import * as som from "@hiryu/shogi-object-model";

const HandContainer = styled.div`
  user-select: none;
`

const HandHeader = styled.h4`
  margin: 0;
  font-size: 1em;
`

const HandPiece = styled<{ isActive: boolean }, "div">("div")`
  line-height: 1.4;
  ${props => props.isActive && css`
    color: red;
  `}
`

const PieceCharacter = styled.span``

const PieceCount = styled.span`
  display: inline-block;
  font-size: 0.6em;
  margin-left: 0.1em;
`

export interface HandProps {
  hand: som.Hand,
  color: som.Color,
  activePiece?: som.Piece,
  onClickPiece: (piece: som.Piece) => void;
}

export function Hand(props: HandProps) {
  const els = [];
  const pieces = [som.Piece.FU, som.Piece.KY, som.Piece.KE, som.Piece.GI, som.Piece.KI, som.Piece.KA, som.Piece.HI];
  for (const p of pieces) {
    const n = som.getNumPieces(props.hand, p);
    if (n === 0) {
      continue;
    }
    const isActive = props.activePiece === p;
    els.push(
      <HandPiece
        key={`${p}-${n}`}
        isActive={isActive}
        onClick={e => { e.stopPropagation(); props.onClickPiece(p) }}
      >
        <PieceCharacter>{som.formats.general.stringifyPiece(p)}</PieceCharacter>
        <PieceCount>{n}</PieceCount>
      </HandPiece>
    );
  }
  return (
    <HandContainer>
      <HandHeader>{som.formats.general.stringifyColor(props.color)}</HandHeader>
      {els}
    </HandContainer>
  )
}

export default Hand;
