import React from "react";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";
import { GameProps } from "./Game";
import { GameObject, GameObjectType, PromotionSelectorProps } from "./entities";

export type GameComponent = React.ComponentType<GameProps>;

export interface InteractableGameProps {
  gameNode: som.rules.standard.GameNode;
  onMoveEvent: (e: som.MoveEvent) => void;
}

export interface InteractableGameState {
  activeGameObject?: GameObject;
  promotionSelector?: PromotionSelectorProps;
}

export default function interactable(WrappedComponent: GameComponent) {
  return class InteractableGame extends React.Component<
    InteractableGameProps,
    InteractableGameState
  > {
    constructor(props: InteractableGameProps) {
      super(props);
      this.state = {};
    }

    render() {
      const data = tree.getValue(this.props.gameNode);
      return (
        <div onClick={() => !this.state.promotionSelector && this.setActiveGameObject()}>
          <WrappedComponent
            state={data.state}
            activeGameObject={this.state.activeGameObject}
            promotionSelector={this.state.promotionSelector}
            onClickGameObject={obj => this.updateActiveGameObject(obj)}
            lastMovedTo={
              (data.byEvent &&
                data.byEvent.type === som.EventType.MOVE &&
                data.byEvent.dstSquare) ||
              undefined
            }
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
        promotionSelector: undefined,
      });
    }

    updateActiveGameObject(obj: GameObject) {
      // accept no object in selecting promotion options
      if (this.state.promotionSelector) {
        return;
      }
      const gameNode = this.props.gameNode;
      const gameNodeData = tree.getValue(gameNode);
      const prev = this.state.activeGameObject;
      if (prev) {
        switch (prev.type) {
          case GameObjectType.BOARD_SQUARE: {
            switch (obj.type) {
              case GameObjectType.BOARD_SQUARE: {
                if (som.squareEquals(prev.square, obj.square)) {
                  return this.resetActivatedState();
                }
                const move = (promote: boolean) => {
                  this.props.onMoveEvent(
                    som.newMoveEvent(gameNodeData.state.nextTurn, prev.square, obj.square, promote),
                  );
                  return this.resetActivatedState();
                };
                const mcs = som.rules.standard
                  .searchMoveCandidates(gameNodeData.state.board, prev.square)
                  .filter(mc => som.squareEquals(mc.dst, obj.square));
                const isPromotionSelectable = mcs.length === 2;
                if (isPromotionSelectable) {
                  const cp = som.getBoardSquare(gameNodeData.state.board, prev.square);
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
                this.props.onMoveEvent(
                  som.newDropEvent(gameNodeData.state.nextTurn, prev.piece, obj.square),
                );
                return this.resetActivatedState();
              }
              case GameObjectType.HAND_PIECE: {
                if (prev.piece === obj.piece) {
                  return this.resetActivatedState();
                }
                break;
              }
            }
            break;
          }
        }
      }
      switch (obj.type) {
        case GameObjectType.BOARD_SQUARE: {
          const cp = som.getBoardSquare(gameNodeData.state.board, obj.square);
          if (!cp || cp.color !== gameNodeData.state.nextTurn) {
            return this.setActiveGameObject();
          }
          break;
        }
        case GameObjectType.HAND_PIECE: {
          if (obj.color !== gameNodeData.state.nextTurn) {
            return this.setActiveGameObject();
          } else {
            const n = som.getNumPieces(som.getHand(gameNodeData.state.hands, obj.color), obj.piece);
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
