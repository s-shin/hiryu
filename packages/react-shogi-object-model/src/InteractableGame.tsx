import React from "react";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";
import Game from "./Game";
import useGameInteraction, { GameInteractionHookProps } from "./useGameInteraction";

export type InteractableGameProps = GameInteractionHookProps;

export const InteractableGame: React.FC<InteractableGameProps> = props => {
  const interaction = useGameInteraction(props);

  const data = tree.getValue(props.gameNode);

  return (
    <Game
      state={data.state}
      activeGameObject={interaction.activeGameObject}
      promotionSelector={interaction.promotionSelector}
      onClickGameObject={obj => interaction.updateActiveGameObject(obj)}
      lastMovedTo={
        (data.byEvent && data.byEvent.type == som.EventType.MOVE && data.byEvent.dstSquare) ||
        undefined
      }
    />
  );
}

export default InteractableGame;
