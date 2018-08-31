import * as som from "@hiryu/shogi-object-model";

export enum GameObjectType {
  BOARD_SQUARE,
  HAND_PIECE,
}

export interface GameObjectProps {
  type: GameObjectType;
}

export interface BoardSquare extends GameObjectProps {
  type: GameObjectType.BOARD_SQUARE;
  square: som.Square;
}

export interface HandPiece extends GameObjectProps {
  type: GameObjectType.HAND_PIECE;
  color: som.Color;
  piece: som.Piece;
}

export type GameObject = BoardSquare | HandPiece;
