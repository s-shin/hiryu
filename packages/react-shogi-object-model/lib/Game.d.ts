import React from "react";
import * as som from "@hiryu/shogi-object-model";
import { GameObject, PromotionSelectorProps } from "./entities";
export interface GameProps {
    state: som.State;
    activeGameObject?: GameObject;
    onClickGameObject: (obj: GameObject) => void;
    promotionSelector?: PromotionSelectorProps;
    lastMovedTo?: som.Square;
}
export declare const Game: React.FC<GameProps>;
export default Game;
