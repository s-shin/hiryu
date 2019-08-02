import React from "react";
import styled, { css } from "styled-components";
import * as som from "@hiryu/shogi-object-model";
import Hand from "./Hand";
import Board from "./Board";
import { GameObject, GameObjectType, PromotionSelectorProps } from "./entities";

export interface GameProps {
  state: som.State;
  activeGameObject?: GameObject;
  onClickGameObject: (obj: GameObject) => void;
  promotionSelector?: PromotionSelectorProps;
  lastMovedTo?: som.Square;
}

const Container = styled.div`
  display: flex;
`;

const HandColumn = styled.div<{ color?: som.Color }>`
  ${props =>
    props.color === som.Color.WHITE &&
    css`
      transform: rotate(180deg);
    `};
`;

const BoardColumn = styled.div`
  margin: 0 0.5em;
`;

export function Game(props: GameProps) {
  const state = props.state;

  const active = props.activeGameObject;

  return (
    <Container>
      <HandColumn color={som.Color.WHITE}>
        <Hand
          hand={som.getHand(state.hands, som.Color.WHITE)}
          color={som.Color.WHITE}
          activePiece={
            active && active.type === GameObjectType.HAND_PIECE && active.color === som.Color.WHITE
              ? active.piece
              : undefined
          }
          onClickPiece={piece =>
            props.onClickGameObject({
              type: GameObjectType.HAND_PIECE,
              color: som.Color.WHITE,
              piece,
            })
          }
        />
      </HandColumn>
      <BoardColumn>
        <Board
          board={state.board}
          highlight={{
            selected:
              active && active.type === GameObjectType.BOARD_SQUARE ? active.square : undefined,
            lastMovedTo: props.lastMovedTo,
          }}
          promotionSelector={props.promotionSelector}
          onClickSquare={sq =>
            props.onClickGameObject({ type: GameObjectType.BOARD_SQUARE, square: sq })
          }
        />
      </BoardColumn>
      <HandColumn>
        <Hand
          hand={som.getHand(state.hands, som.Color.BLACK)}
          color={som.Color.BLACK}
          activePiece={
            active && active.type === GameObjectType.HAND_PIECE && active.color === som.Color.BLACK
              ? active.piece
              : undefined
          }
          onClickPiece={piece =>
            props.onClickGameObject({
              type: GameObjectType.HAND_PIECE,
              color: som.Color.BLACK,
              piece,
            })
          }
        />
      </HandColumn>
    </Container>
  );
}

export default Game;
