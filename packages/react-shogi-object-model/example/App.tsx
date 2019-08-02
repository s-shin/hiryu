import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import Theme from "../src/theme";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";
import InteractableGame from "../src/InteractableGame";

const theme: Theme = {};

export default function App() {
  const [currentGameNode, setCurrentGameNode] = useState(som.rules.standard.newRootGameNode());

  return (
    <ThemeProvider theme={theme}>
      <InteractableGame
        gameNode={currentGameNode}
        onMoveEvent={e => {
          const next = som.rules.standard.applyEvent(currentGameNode, e);
          if (next.violations.length > 0) {
            console.log(next);
            return;
          }
          setCurrentGameNode(tree.appendChild(currentGameNode, next));
        }}
      />
    </ThemeProvider>
  );
}
