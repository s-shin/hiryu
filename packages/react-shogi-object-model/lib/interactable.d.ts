import React from "react";
import * as som from "@hiryu/shogi-object-model";
import { GameProps } from "./Game";
import { GameObject, PromotionSelectorProps } from "./entities";
export declare type GameComponent = React.ComponentType<GameProps>;
export interface InteractableGameProps {
    gameNode: som.rules.standard.GameNode;
    onMoveEvent: (e: som.MoveEvent) => void;
}
export interface InteractableGameState {
    activeGameObject?: GameObject;
    promotionSelector?: PromotionSelectorProps;
}
export default function interactable(WrappedComponent: GameComponent): {
    new (props: InteractableGameProps): {
        render(): JSX.Element;
        setActiveGameObject(obj?: import("./entities").BoardSquare | import("./entities").HandPiece | undefined): void;
        resetActivatedState(): void;
        updateActiveGameObject(obj: GameObject): void;
        setState<K extends "activeGameObject" | "promotionSelector">(state: InteractableGameState | ((prevState: Readonly<InteractableGameState>, props: Readonly<InteractableGameProps>) => InteractableGameState | Pick<InteractableGameState, K> | null) | Pick<InteractableGameState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<InteractableGameProps>;
        state: Readonly<InteractableGameState>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
