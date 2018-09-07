import * as som from "@hiryu/shogi-object-model";

export enum GameObjectType {
  BOARD_SQUARE,
  HAND_PIECE,
}

export interface CommonGameObjectProps {
  type: GameObjectType;
}

export interface BoardSquare extends CommonGameObjectProps {
  type: GameObjectType.BOARD_SQUARE;
  square: som.Square;
}

export interface HandPiece extends CommonGameObjectProps {
  type: GameObjectType.HAND_PIECE;
  color: som.Color;
  piece: som.Piece;
}

export type GameObject = BoardSquare | HandPiece;

//---

export interface PromotionSelectorProps {
  piece: som.Piece;
  dstSquare: som.Square;
  onSelect: (promote: boolean) => void;
}
