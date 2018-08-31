import React from "react";
import Game from "./components/Game";
import * as gameHelper from "./helpers/game";
import { GameObject } from "./helpers/game_objects";

interface ShogiViewProps {
  G: gameHelper.Game;
}

interface ShogiViewState {
  activeGameObject?: GameObject;
}

export default class ShogiView extends React.Component<ShogiViewProps, ShogiViewState> {
  constructor(props: ShogiViewProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div onClick={() => this.setActiveGameObject()}>
        <Game
          game={this.props.G}
          activeGameObject={this.state.activeGameObject}
          onClickGameObject={obj => this.setActiveGameObject(obj)}
        />
      </div>
    );
  }

  setActiveGameObject(obj?: GameObject) {
    this.setState({ ...this.state, activeGameObject: obj });
  }
}
