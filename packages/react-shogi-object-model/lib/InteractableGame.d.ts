/// <reference types="react" />
declare const InteractableGame: {
    new (props: import("./interactable").InteractableGameProps): {
        render(): JSX.Element;
        setActiveGameObject(obj?: import("./entities").BoardSquare | import("./entities").HandPiece | undefined): void;
        resetActivatedState(): void;
        updateActiveGameObject(obj: import("./entities").GameObject): void;
        setState<K extends "activeGameObject" | "promotionSelector">(state: import("./interactable").InteractableGameState | ((prevState: Readonly<import("./interactable").InteractableGameState>, props: Readonly<import("./interactable").InteractableGameProps>) => import("./interactable").InteractableGameState | Pick<import("./interactable").InteractableGameState, K> | null) | Pick<import("./interactable").InteractableGameState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: import("react").ReactNode;
        }> & Readonly<import("./interactable").InteractableGameProps>;
        state: Readonly<import("./interactable").InteractableGameState>;
        context: any;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
    };
};
export default InteractableGame;
