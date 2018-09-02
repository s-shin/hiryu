import React from "react";
import styled from "styled-components";
import * as som from "@hiryu/shogi-object-model";
import Hand from "./Hand";
import Board from "./Board";
import * as gameHelper from "../helpers/game";
import { GameObject, GameObjectType } from "../helpers/game_objects";
import { PromotionSelectorProps } from "./Board";

export interface GameProps {
  game: gameHelper.Game;
  activeGameObject?: GameObject;
  onClickGameObject: (obj: GameObject) => void;
  promotionSelector?: PromotionSelectorProps;
}

export function Game(props: GameProps) {
  const state = props.game.current.state;

  const Container = styled.div`
    display: flex;
  `;
  const Column = styled.div`
    margin: 1rem;
  `;

  const active = props.activeGameObject;

  return (
    <Container>
      <Column>
        <Hand
          hand={som.getHand(state.hands, som.Color.WHITE)}
          color={som.Color.WHITE}
          activePiece={
            active
              && active.type === GameObjectType.HAND_PIECE
              && active.color === som.Color.WHITE
              ? active.piece
              : undefined
          }
          onClickPiece={piece => props.onClickGameObject({ type: GameObjectType.HAND_PIECE, color: som.Color.WHITE, piece })}
        />
      </Column>
      <Column>
        <Board
          board={state.board}
          activeSquare={active && active.type === GameObjectType.BOARD_SQUARE ? active.square : undefined}
          promotionSelector={props.promotionSelector}
          onClickSquare={sq => props.onClickGameObject({ type: GameObjectType.BOARD_SQUARE, square: sq })}
        />
      </Column>
      <Column>
        <Hand
          hand={som.getHand(state.hands, som.Color.BLACK)}
          color={som.Color.BLACK}
          activePiece={
            active
              && active.type === GameObjectType.HAND_PIECE
              && active.color === som.Color.BLACK
              ? active.piece
              : undefined
          }
          onClickPiece={piece => props.onClickGameObject({ type: GameObjectType.HAND_PIECE, color: som.Color.BLACK, piece })}
        />
      </Column>
    </Container>
  )
}

export default Game;
