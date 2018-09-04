/// <reference types="react" />
import * as som from "@hiryu/shogi-object-model";
import { PromotionSelector } from "./entities";
export interface BoardProps {
    board: som.Board;
    activeSquare?: som.Square;
    onClickSquare: (sq: som.Square) => void;
    promotionSelector?: PromotionSelector;
}
export declare function Board(props: BoardProps): JSX.Element;
export default Board;
