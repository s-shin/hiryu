/// <reference types="react" />
declare const InteractableGame: {
    new (props: import("./interactable").InteractableGameProps): {
        render(): JSX.Element;
        setActiveGameObject(obj?: import("./entities").BoardSquare | import("./entities").HandPiece | undefined): void;
        resetActivatedState(): void;
        updateActiveGameObject(obj: import("./entities").GameObject): void;
        context: any;
        setState<K extends "activeGameObject" | "promotionSelector">(state: import("./interactable").InteractableGameState | ((prevState: Readonly<import("./interactable").InteractableGameState>, props: Readonly<import("./interactable").InteractableGameProps>) => import("./interactable").InteractableGameState | Pick<import("./interactable").InteractableGameState, K> | null) | Pick<import("./interactable").InteractableGameState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<import("react").PropsWithChildren<import("./interactable").InteractableGameProps>>;
        state: Readonly<import("./interactable").InteractableGameState>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
    };
    contextType?: import("react").Context<any> | undefined;
};
export default InteractableGame;
