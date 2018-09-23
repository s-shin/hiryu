import React from "react";
import styled from "@hiryu/react-shogi-object-model/src/styled-components";
import { Grid, Typography } from "@material-ui/core";
import { GridProps } from "@material-ui/core/Grid";

export const colors = {
  border: "#ccc",
};

//---

export const Pane: React.SFC<GridProps> = props => (
  <Grid container direction="column" {...props}>
    {props.children}
  </Grid>
);

const PaneInnerBase = styled.div`
  padding: 0.5rem;
`;

//---

const PaneHeaderInner = styled(PaneInnerBase)`
  border-bottom: 1px solid ${colors.border};
  background-color: #f3f3f3;
`;

const PaneHeaderBody = styled(Typography).attrs({
  variant: "caption",
})`
  text-transform: uppercase;
  margin: 0.5rem;
`;

export const PaneHeader: React.SFC<GridProps> = props => (
  <Grid item {...{ ...props, children: undefined }}>
    <PaneHeaderInner>
      <PaneHeaderBody>{props.children}</PaneHeaderBody>
    </PaneHeaderInner>
  </Grid>
);

//---

const PaneBodyInner = styled(PaneInnerBase)`
  height: 100%;
  overflow: auto;
`;

export const PaneBody: React.SFC<GridProps> = props => (
  <Grid item xs {...props}>
    <PaneBodyInner>{props.children}</PaneBodyInner>
  </Grid>
);
