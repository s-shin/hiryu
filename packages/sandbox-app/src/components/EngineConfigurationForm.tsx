import React, { useState } from "react";
import { FormControl, Button, TextField, FormControlLabel, Checkbox } from "@material-ui/core";
import { EngineOptions, EngineOptionDefinition } from "@hiryu/usi-engine";

interface EngineOptionFormProps {
  opt: EngineOptionDefinition;
  value?: string;
  onChange: (name: string, value: string) => void;
}

const EngineOptionForm: React.FC<EngineOptionFormProps> = props => {
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
};

export interface EngineConfigurationFormProps {
  engineOptions: EngineOptions;
  onSubmit: (optionValues: { [name: string]: string }) => any;
}

const EngineConfigurationForm: React.FC<EngineConfigurationFormProps> = props => {
  const [optionValues, setOptionValues] = useState<{ [name: string]: string }>({});

  const forms = [];
  for (const name of Object.keys(props.engineOptions)) {
    const opt = props.engineOptions[name];
    forms.push(
      <FormControl margin="dense" style={{ marginRight: 12 }}>
        <EngineOptionForm
          opt={opt}
          value={optionValues[name]}
          onChange={(name, value) => setOptionValues({ ...optionValues, [name]: value })}
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
          onClick={() => props.onSubmit(optionValues)}
        >
          OK
        </Button>
      </FormControl>
    </React.Fragment>
  );
};

export default EngineConfigurationForm;
