import React from "react";
import * as som from "@hiryu/shogi-object-model";
export interface HandProps {
    hand: som.Hand;
    color: som.Color;
    activePiece?: som.Piece;
    onClickPiece: (piece: som.Piece) => void;
}
export declare const Hand: React.FC<HandProps>;
export default Hand;
