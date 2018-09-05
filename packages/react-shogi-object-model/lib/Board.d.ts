/// <reference types="react" />
import * as som from "@hiryu/shogi-object-model";
import { PromotionSelectorProps } from "./entities";
export interface BoardProps {
    board: som.Board;
    activeSquare?: som.Square;
    onClickSquare: (sq: som.Square) => void;
    promotionSelector?: PromotionSelectorProps;
}
export declare function Board(props: BoardProps): JSX.Element;
export default Board;
