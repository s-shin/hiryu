import React from "react";
import Game from "./components/Game";
import * as som from "@hiryu/shogi-object-model";
import * as gameHelper from "./helpers/game";
import { GameObject, GameObjectType } from "./helpers/game_objects";
import { GameState } from "./Shogi";

interface ShogiViewProps {
  G: GameState;
  moves: any;
}

interface ShogiViewState {
  activeGameObject?: GameObject;
}

export default class ShogiView extends React.Component<ShogiViewProps, ShogiViewState> {
  constructor(props: ShogiViewProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div onClick={() => this.setActiveGameObject()}>
        <Game
          game={this.props.G}
          activeGameObject={this.state.activeGameObject}
          onClickGameObject={obj => this.updateActiveGameObject(obj)}
        />
      </div>
    );
  }

  setActiveGameObject(obj?: GameObject) {
    this.setState({ ...this.state, activeGameObject: obj });
  }

  updateActiveGameObject(obj: GameObject) {
    const gameNode = this.props.G.current;
    const prev = this.state.activeGameObject;
    if (prev) {
      switch (prev.type) {
        case GameObjectType.BOARD_SQUARE: {
          switch (obj.type) {
            case GameObjectType.BOARD_SQUARE: {
              const promote = false; // TODO
              const g = gameHelper.move(this.props.G, prev.square, obj.square, promote);
              if (g.current.violations.length === 0) {
                this.props.moves.move(prev.square, obj.square, promote);
                return this.setActiveGameObject();
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
              const g = gameHelper.drop(this.props.G, prev.piece, obj.square);
              if (g.current.violations.length === 0) {
                this.props.moves.drop(prev.piece, obj.square);
                return this.setActiveGameObject();
              }
              break;
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
}
