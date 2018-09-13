import React from "react";
import styled from "@hiryu/react-shogi-object-model/src/styled-components";
import { Grid, Typography } from "@material-ui/core";
import { GridProps } from "@material-ui/core/Grid";

export const Panel: React.SFC<GridProps> = props => (
  <Grid container direction="column" {...props}>
    {props.children}
  </Grid>
);

const PanelInnerBase = styled.div`
  padding: 0.5rem;
`;

//---

const PanelHeaderInner = styled(PanelInnerBase)`
  border-bottom: 1px solid #ccc;
  background-color: #f3f3f3;
`;

const PanelHeaderBody = styled(Typography).attrs({
  variant: "caption",
})`
  text-transform: uppercase;
  margin: 0.5rem;
`;

export const PanelHeader: React.SFC<GridProps> = props => (
  <Grid item {...{ ...props, children: undefined }}>
    <PanelHeaderInner>
      <PanelHeaderBody>{props.children}</PanelHeaderBody>
    </PanelHeaderInner>
  </Grid>
);

//---

const PanelBodyInner = styled(PanelInnerBase)`
  height: 100%;
  overflow: auto;
`;

export const PanelBody: React.SFC<GridProps> = props => (
  <Grid item xs {...props}>
    <PanelBodyInner>{props.children}</PanelBodyInner>
  </Grid>
);
