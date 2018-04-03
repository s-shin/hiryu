import { Record } from "immutable";
import * as core from "@hiryu/shogi-core";

export enum GameObjectType {
  BOARD_SQUARE,
  HAND_PIECE,
}

export class BoardSquare extends Record({
  pos: new core.Position(),
}) {
  readonly type = GameObjectType.BOARD_SQUARE;
}

export class HandPiece extends Record({
  color: core.Color.BLACK,
  piece: core.Piece.FU,
}) {
  readonly type = GameObjectType.HAND_PIECE;
}

export type GameObject = BoardSquare | HandPiece;
