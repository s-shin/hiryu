import React from "react";
import * as som from "@hiryu/shogi-object-model";
import { GameProps } from "./Game";
import { GameObject, GameObjectType, PromotionSelectorProps } from "./entities";

export type GameComponent = React.ComponentType<GameProps>

export interface InteractableGameProps {
  gameNode: som.rules.standard.GameNode;
  onMoveEvent: (e: som.MoveEvent) => void;
}

export interface InteractableGameState {
  activeGameObject?: GameObject;
  promotionSelector?: PromotionSelectorProps;
}

export default function interactable(WrappedComponent: GameComponent) {
  return class InteractableGame extends React.Component<InteractableGameProps, InteractableGameState> {
    constructor(props: InteractableGameProps) {
      super(props);
      this.state = {};
    }

    render() {
      return (
        <div onClick= {() => !this.state.promotionSelector && this.setActiveGameObject()}>
          <WrappedComponent
            state={ this.props.gameNode.state }
            activeGameObject = { this.state.activeGameObject }
            promotionSelector = { this.state.promotionSelector }
            onClickGameObject = { obj => this.updateActiveGameObject(obj) }
          />
        </div>
      );
    }

    setActiveGameObject(obj?: GameObject) {
      this.setState({ ...this.state, activeGameObject: obj });
    }

    resetActivatedState() {
      this.setState({
        ...this.state,
        activeGameObject: undefined,
        promotionSelector: undefined
      });
    }

    updateActiveGameObject(obj: GameObject) {
      // accept no object in selecting promotion options
      if (this.state.promotionSelector) {
        return;
      }
      const gameNode = this.props.gameNode;
      const prev = this.state.activeGameObject;
      if (prev) {
        switch (prev.type) {
          case GameObjectType.BOARD_SQUARE: {
            switch (obj.type) {
              case GameObjectType.BOARD_SQUARE: {
                const move = (promote: boolean) => {
                  this.props.onMoveEvent(som.newMoveEvent(gameNode.state.nextTurn, prev.square, obj.square, promote));
                  return this.resetActivatedState();
                };
                const mcs = som.rules.standard.searchMoveCandidates(gameNode.state.board, prev.square)
                  .filter(mc => som.squareEquals(mc.dst, obj.square));
                const isPromotionSelectable = mcs.length === 2;
                if (isPromotionSelectable) {
                  const cp = som.getBoardSquare(gameNode.state.board, prev.square);
                  this.setState({
                    ...this.state,
                    promotionSelector: {
                      piece: cp!.piece,
                      dstSquare: obj.square,
                      onSelect(promote: boolean) {
                        move(promote);
                      },
                    },
                  });
                  return;
                }
                const maybeMovable = mcs.length > 0;
                if (maybeMovable) {
                  move(mcs[0].promote);
                }
                break;
              }
              case GameObjectType.HAND_PIECE: {
                break;
              }
            }
            break;
          }
          case GameObjectType.HAND_PIECE: {
            switch (obj.type) {
              case GameObjectType.BOARD_SQUARE: {
                this.props.onMoveEvent(som.newDropEvent(gameNode.state.nextTurn, prev.piece, obj.square));
                return this.resetActivatedState();
              }
              case GameObjectType.HAND_PIECE: {
                break;
              }
            }
            break;
          }
        }
      }
      switch (obj.type) {
        case GameObjectType.BOARD_SQUARE: {
          const cp = som.getBoardSquare(gameNode.state.board, obj.square);
          if (!cp || cp.color !== gameNode.state.nextTurn) {
            return this.setActiveGameObject();
          }
          break;
        }
        case GameObjectType.HAND_PIECE: {
          if (obj.color !== gameNode.state.nextTurn) {
            return this.setActiveGameObject();
          } else {
            const n = som.getNumPieces(som.getHand(gameNode.state.hands, obj.color), obj.piece);
            if (n === 0) {
              return this.setActiveGameObject();
            }
          }
          break;
        }
      }
      this.setActiveGameObject(obj);
    }
  };
}

