import React from "react";
import { FormControl, Button } from "@material-ui/core";
import { EngineOptions } from "@hiryu/usi-engine/src";
import styled from "styled-components";

const Pre = styled.pre`
  font-size: 0.6em;
  height: 6em;
  overflow: auto;
  white-space: pre-wrap;
  margin: 0 0 0.3rem;
  border-left: 3px solid #cce;
  padding-left: 0.5em;
`;

export interface EngineConfigurationFormProps {
  engineOptions: EngineOptions;
  onSubmit: () => any;
}

export interface EngineConfigurationFormState {}

export default class EngineConfigurationForm extends React.Component<
  EngineConfigurationFormProps,
  EngineConfigurationFormState
> {
  render() {
    const lines = [];
    for (const k of Object.keys(this.props.engineOptions)) {
      const opt = this.props.engineOptions[k];
      lines.push(JSON.stringify(opt));
    }
    return (
      <React.Fragment>
        <Pre>{lines.join("\n")}</Pre>
        <FormControl>
          <Button size="small" color="primary" onClick={() => this.props.onSubmit()}>
            OK
          </Button>
        </FormControl>
      </React.Fragment>
    );
  }
}
