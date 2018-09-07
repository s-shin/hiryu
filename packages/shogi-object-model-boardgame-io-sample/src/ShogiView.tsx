import React from "react";
import { GameState } from "./Shogi";
import { InteractableGame } from "@hiryu/react-shogi-object-model";

interface ShogiViewProps {
  G: GameState;
  moves: any;
  events: any;
}

export default class ShogiView extends React.Component<ShogiViewProps> {
  constructor(props: ShogiViewProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <InteractableGame
        gameNode={this.props.G.gameNode}
        onMoveEvent={e => this.props.moves.applyMoveEvent(e)}
      />
    );
  }
}
