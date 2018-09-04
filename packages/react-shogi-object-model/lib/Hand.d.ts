/// <reference types="react" />
import * as som from "@hiryu/shogi-object-model";
export interface HandProps {
    hand: som.Hand;
    color: som.Color;
    activePiece?: som.Piece;
    onClickPiece: (piece: som.Piece) => void;
}
export declare function Hand(props: HandProps): JSX.Element;
export default Hand;
