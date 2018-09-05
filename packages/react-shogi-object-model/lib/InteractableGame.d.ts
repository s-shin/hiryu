/// <reference types="react" />
declare const InteractableGame: {
    new (props: import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameProps): {
        render(): JSX.Element;
        setActiveGameObject(obj?: import("@hiryu/react-shogi-object-model/src/entities").BoardSquare | import("@hiryu/react-shogi-object-model/src/entities").HandPiece | undefined): void;
        resetActivatedState(): void;
        updateActiveGameObject(obj: import("@hiryu/react-shogi-object-model/src/entities").GameObject): void;
        setState<K extends "activeGameObject" | "promotionSelector">(state: import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameState | ((prevState: Readonly<import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameState>, props: Readonly<import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameProps>) => import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameState | Pick<import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameState, K> | null) | Pick<import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: import("react").ReactNode;
        }> & Readonly<import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameProps>;
        state: Readonly<import("@hiryu/react-shogi-object-model/src/interactable").InteractableGameState>;
        context: any;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
    };
};
export default InteractableGame;
