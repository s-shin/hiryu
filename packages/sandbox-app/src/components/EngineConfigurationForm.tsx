import React from "react";
import { FormControl, Button, TextField, FormControlLabel, Checkbox } from "@material-ui/core";
import { EngineOptions, EngineOptionDefinition } from "@hiryu/usi-engine";

interface EngineOptionFormProps {
  opt: EngineOptionDefinition;
  value?: string;
  onChange: (name: string, value: string) => void;
}

function EngineOptionForm(props: EngineOptionFormProps) {
  const { opt, value, onChange } = props;
  const id = `engine-option-form-${opt.name}`;
  switch (opt.type) {
    case "string": {
      return (
        <TextField
          id={id}
          label={opt.name}
          value={value || opt.default}
          onChange={e => {
            onChange(opt.name, e.target.value);
          }}
        />
      );
    }
    case "spin": {
      return (
        <TextField
          id={id}
          label={opt.name}
          type="number"
          value={value || opt.default}
          onChange={e => {
            onChange(opt.name, e.target.value);
          }}
        />
      );
    }
    case "button": {
      return <Button variant="outlined">{opt.name}</Button>;
    }
    case "check": {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value !== undefined ? value === "true" : opt.default}
              onChange={e => {
                onChange(opt.name, e.target.checked ? "true" : "false");
              }}
            />
          }
          label={opt.name}
        />
      );
    }
  }
  return (
    <span>
      {opt.name} {opt.type}
    </span>
  );
}

export interface EngineConfigurationFormProps {
  engineOptions: EngineOptions;
  onSubmit: (optionValues: { [name: string]: string }) => any;
}

export interface EngineConfigurationFormState {
  optionValues: { [name: string]: string };
}

export default class EngineConfigurationForm extends React.Component<
  EngineConfigurationFormProps,
  EngineConfigurationFormState
> {
  state: EngineConfigurationFormState = {
    optionValues: {},
  };

  render() {
    const forms = [];
    for (const name of Object.keys(this.props.engineOptions)) {
      const opt = this.props.engineOptions[name];
      forms.push(
        <FormControl margin="dense" style={{ marginRight: 12 }}>
          <EngineOptionForm
            opt={opt}
            value={this.state.optionValues[name]}
            onChange={(name, value) => {
              this.setState({
                optionValues: {
                  ...this.state.optionValues,
                  [name]: value,
                },
              });
            }}
          />
        </FormControl>,
      );
    }
    return (
      <React.Fragment>
        <div style={{ display: "flex", flexWrap: "wrap", maxHeight: 300, overflow: "auto" }}>
          {forms}
        </div>
        <FormControl margin="normal">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => this.props.onSubmit(this.state.optionValues)}
          >
            OK
          </Button>
        </FormControl>
      </React.Fragment>
    );
  }
}
