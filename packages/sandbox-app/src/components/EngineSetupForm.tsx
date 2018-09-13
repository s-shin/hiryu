import React from "react";
import { FormControl, Input, InputLabel, Button, CircularProgress, Grid } from "@material-ui/core";

export interface EngineSetupFormProps {
  onSubmit: (engineURL: string) => any;
  connecting?: boolean;
}

export interface EngineSetupFormState {
  engineURL: string;
}

export default class EngineSetupForm extends React.Component<EngineSetupFormProps, EngineSetupFormState> {
  state = {
    engineURL: "ws://127.0.0.1:3001",
  };

  render() {
    return (
      <Grid container spacing={8} alignItems="flex-end">
        <Grid item>
          <FormControl>
            <InputLabel htmlFor="engine-setup-form-engine-url">Engine URL</InputLabel>
            <Input
              id="engine-setup-form-engine-url"
              placeholder="ws://..."
              value={this.state.engineURL}
              onChange={e => this.setState({ ...this.state, engineURL: e.target.value })}
              disabled={this.props.connecting}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <Button
              size="small"
              color="primary"
              onClick={() => this.props.onSubmit(this.state.engineURL)}
              disabled={this.props.connecting}
            >
              Connect
            </Button>
          </FormControl>
        </Grid>
        {this.props.connecting && (
          <Grid item style={{ paddingBottom: "7px" }}>
            <FormControl>
              <CircularProgress size={16} />
            </FormControl>
          </Grid>
        )}
      </Grid>
    );
  }
}
