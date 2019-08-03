/// <reference types="react" />
import * as som from "@hiryu/shogi-object-model";
import { GameObject, PromotionSelectorProps } from "./entities";
export interface GameInteractionHookProps {
    gameNode: som.rules.standard.GameNode;
    onMoveEvent: (e: som.MoveEvent) => void;
}
export default function useGameInteraction(props: GameInteractionHookProps): {
    activeGameObject: import("./entities").BoardSquare | import("./entities").HandPiece | undefined;
    setActiveGameObject: import("react").Dispatch<import("react").SetStateAction<import("./entities").BoardSquare | import("./entities").HandPiece | undefined>>;
    promotionSelector: PromotionSelectorProps | undefined;
    updateActiveGameObject: (dstObj: GameObject) => void;
};
