import { useState } from "react";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";
import { GameObject, GameObjectType, PromotionSelectorProps } from "./entities";

export interface GameInteractionHookProps {
  gameNode: som.rules.standard.GameNode;
  onMoveEvent: (e: som.MoveEvent) => void;
}

export default function useGameInteraction(props: GameInteractionHookProps) {
  const [activeGameObject, setActiveGameObject] = useState<GameObject | undefined>();
  const [promotionSelector, setPromotionSelector] = useState<PromotionSelectorProps | undefined>();

  function resetState() {
    setActiveGameObject(undefined);
    setPromotionSelector(undefined);
  }

  function updateActiveGameObject(dstObj: GameObject) {
    if (promotionSelector) {
      // No object is acceptable in selecting promotion choices.
      return;
    }

    const gameNode = props.gameNode;
    const gameNodeData = tree.getValue(gameNode);
    const srcObj = activeGameObject;
    if (srcObj) {
      switch (srcObj.type) {
        case GameObjectType.BOARD_SQUARE: {
          switch (dstObj.type) {
            case GameObjectType.BOARD_SQUARE: {
              if (som.squareEquals(srcObj.square, dstObj.square)) {
                // selected same square, so canceled.
                return resetState();
              }

              const move = (promote: boolean) => {
                props.onMoveEvent(
                  som.newMoveEvent(
                    gameNodeData.state.nextTurn,
                    srcObj.square,
                    dstObj.square,
                    promote,
                  ),
                );
                return resetState();
              };

              const mcs = som.rules.standard
                .searchMoveCandidates(gameNodeData.state.board, srcObj.square)
                .filter(mc => som.squareEquals(mc.dst, dstObj.square));

              const isPromotionSelectable = mcs.length == 2;
              if (isPromotionSelectable) {
                const cp = som.getBoardSquare(gameNodeData.state.board, srcObj.square);
                // promotionSelector.onSelect should be called in hooked component.
                return setPromotionSelector({
                  piece: cp!.piece,
                  dstSquare: dstObj.square,
                  onSelect: move,
                });
              }

              const maybeMovable = mcs.length > 0;
              if (maybeMovable) {
                return move(mcs[0].promote);
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
          switch (dstObj.type) {
            case GameObjectType.BOARD_SQUARE: {
              props.onMoveEvent(
                som.newDropEvent(gameNodeData.state.nextTurn, srcObj.piece, dstObj.square),
              );
              // unselected by any action.
              return resetState();
            }
            case GameObjectType.HAND_PIECE: {
              if (srcObj.piece === dstObj.piece) {
                return resetState();
              }
              break;
            }
          }
          break;
        }
      }
    } // if (srcObj)
    switch (dstObj.type) {
      case GameObjectType.BOARD_SQUARE: {
        const cp = som.getBoardSquare(gameNodeData.state.board, dstObj.square);
        if (!cp || cp.color !== gameNodeData.state.nextTurn) {
          return resetState();
        }
        break;
      }
      case GameObjectType.HAND_PIECE: {
        if (dstObj.color != gameNodeData.state.nextTurn) {
          return resetState();
        }
        const n = som.getNumPieces(som.getHand(gameNodeData.state.hands, dstObj.color), dstObj.piece);
        if (n === 0) {
          return resetState();
        }
        break;
      }
    }
    setActiveGameObject(dstObj);
  }

  return {
    activeGameObject,
    setActiveGameObject,
    promotionSelector,
    updateActiveGameObject,
  };
}
