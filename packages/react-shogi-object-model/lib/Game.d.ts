/// <reference types="react" />
import * as som from "@hiryu/shogi-object-model";
import { GameObject, PromotionSelector } from "./entities";
export interface GameProps {
    state: som.State;
    activeGameObject?: GameObject;
    onClickGameObject: (obj: GameObject) => void;
    promotionSelector?: PromotionSelector;
}
export declare function Game(props: GameProps): JSX.Element;
export default Game;
