import React, { useState } from "react";
import { FormControl, Input, InputLabel, Button, CircularProgress, Grid } from "@material-ui/core";

export interface EngineSetupFormProps {
  onSubmit: (engineURL: string) => any;
  connecting?: boolean;
}

export const EngineSetupForm: React.FC<EngineSetupFormProps> = props => {
  const [engineURL, setEngineURL] = useState("ws://127.0.0.1:3001");

  return (
    // https://material-ui.com/components/grid/#negative-margin
    <div style={{ overflow: "hidden" }}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <FormControl>
            <InputLabel htmlFor="engine-setup-form-engine-url">Engine URL</InputLabel>
            <Input
              id="engine-setup-form-engine-url"
              placeholder="ws://..."
              value={engineURL}
              onChange={e => setEngineURL(e.target.value)}
              disabled={props.connecting}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <Button
              size="small"
              color="primary"
              onClick={() => props.onSubmit(engineURL)}
              disabled={props.connecting}
            >
              Connect
            </Button>
          </FormControl>
        </Grid>
        {props.connecting && (
          <Grid item style={{ paddingBottom: "7px" }}>
            <FormControl>
              <CircularProgress size={16} />
            </FormControl>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default EngineSetupForm;
