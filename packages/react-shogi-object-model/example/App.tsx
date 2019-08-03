import React, { useState } from "react";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";
import InteractableGame from "../src/InteractableGame";

const App: React.FC = () => {
  const [currentGameNode, setCurrentGameNode] = useState(som.rules.standard.newRootGameNode());

  return (
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
  );
};

export default App;
