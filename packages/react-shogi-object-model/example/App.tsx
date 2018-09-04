import React from "react";
// import styled from "styled-components";
import { ThemeProvider, css } from "../src/styled-components";
import Theme from "../src/theme";
import * as som from "@hiryu/shogi-object-model";
import InteractableGame from "../src/InteractableGame";

const theme: Theme = {};

interface AppState {
  current: som.rules.standard.GameNode;
}

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      current: som.rules.standard.newRootGameNode(),
    };
  }

  render() {
    const { current } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <InteractableGame
          gameNode={current}
          onMoveEvent={e => {
            const next = som.rules.standard.applyEvent(current, e);
            if (next.violations.length > 0) {
              console.log(next);
              return;
            }
            this.setState({
              current: next,
            });
          }}
        />
      </ThemeProvider>
    );
  }
}
