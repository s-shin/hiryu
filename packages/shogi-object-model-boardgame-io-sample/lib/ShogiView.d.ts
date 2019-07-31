import React from "react";
import { GameState } from "./Shogi";
interface ShogiViewProps {
    G: GameState;
    moves: any;
    events: any;
}
export default class ShogiView extends React.Component<ShogiViewProps> {
    constructor(props: ShogiViewProps);
    render(): JSX.Element;
}
export {};
