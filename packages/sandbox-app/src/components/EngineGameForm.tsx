import React from "react";
import { FormControl, Input, InputLabel, Button, Grid } from "@material-ui/core";

export interface GameSetupFormProps {
  onSubmit: (posisions: { state: string, moves: string }) => any;
}

export interface GameSetupFormState {
    state: string;
    moves: string;
}

export default class GameSetupForm extends React.Component<GameSetupFormProps, GameSetupFormState> {
  state = {
    state: "startpos",
    moves: "",
  };

  render() {
    return (
      <div>
        <FormControl>
          <InputLabel htmlFor="game-setup-form-state">State</InputLabel>
          <Input
            id="game-setup-form-state"
            placeholder="startpos or sfen ..."
            value={this.state.state}
            onChange={e => this.setState({ ...this.state, state: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="game-setup-form-moves">Moves</InputLabel>
          <Input
            id="game-setup-form-moves"
            placeholder="7g7f 3c3d ..."
            value={this.state.moves}
            onChange={e => this.setState({ ...this.state, moves: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <Button size="small" onClick={() => this.props.onSubmit(this.state)}>
            Setup
          </Button>
        </FormControl>
      </div>
    );
  }
}
