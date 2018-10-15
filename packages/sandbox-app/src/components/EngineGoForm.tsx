import React from "react";
import { Button, FormControl, FormControlLabel, Checkbox, TextField } from "@material-ui/core";
import { GoOptions, DEFAULT_GO_OPTIONS } from "@hiryu/usi-engine";
import produce from "immer";

interface EngineGoFormProps {
  onGo: (opts: GoOptions) => void;
  onStop: () => void;
  isGoing: boolean;
}

interface EngineGoFormState {
  goOpts: GoOptions;
}

class EngineGoForm extends React.Component<EngineGoFormProps, EngineGoFormState> {
  state: EngineGoFormState = {
    goOpts: { ...DEFAULT_GO_OPTIONS },
  };

  render() {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", maxHeight: 300, overflow: "auto" }}>
        <FormControl margin="dense" style={{ marginRight: 12 }}>
          <TextField
            id="engine-go-form-time"
            label="Time"
            type="number"
            value={this.state.goOpts.btime}
            disabled={this.props.isGoing}
            onChange={e => {
              const v = Number(e.target.value);
              this.setState(
                produce(this.state, draft => {
                  draft.goOpts.btime = v;
                  draft.goOpts.wtime = v;
                }),
              );
            }}
          />
        </FormControl>
        <FormControl margin="dense" style={{ marginRight: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.goOpts.infinite}
                disabled={this.props.isGoing}
                onChange={e => {
                  this.setState(
                    produce(this.state, draft => {
                      draft.goOpts.infinite = e.target.checked;
                    }),
                  );
                }}
              />
            }
            label="Infinite"
          />
        </FormControl>
        <div style={{ alignSelf: "flex-end", margin: "0.5rem", width: 166 }}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              if (this.props.isGoing) {
                this.props.onStop();
              } else {
                this.props.onGo(this.state.goOpts);
              }
            }}
          >
            {this.props.isGoing ? "Stop" : "Go"}
          </Button>
        </div>
      </div>
    );
  }
}

export default EngineGoForm;
