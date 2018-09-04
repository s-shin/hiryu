import * as som from "@hiryu/shogi-object-model";
export declare enum GameObjectType {
    BOARD_SQUARE = 0,
    HAND_PIECE = 1
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
export declare type GameObject = BoardSquare | HandPiece;
export interface PromotionSelector {
    piece: som.Piece;
    dstSquare: som.Square;
    onSelect: (promote: boolean) => void;
}
