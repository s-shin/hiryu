import React from "react";
import { IconButton } from "@material-ui/core";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import FastForwardIcon from "@material-ui/icons/FastForward";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

export enum ControlType {
  FIRST,
  PREV2,
  PREV,
  NEXT,
  NEXT2,
  LAST,
}

export interface GameControlPanelProps {
  onClick: (type: ControlType) => void;
}

const GameControlPanel: React.SFC<GameControlPanelProps> = props => {
  const icons = [
    { type: ControlType.FIRST, el: <SkipPreviousIcon /> },
    { type: ControlType.PREV2, el: <FastRewindIcon /> },
    {
      type: ControlType.PREV,
      el: <PlayArrowIcon fontSize="small" style={{ transform: "rotate(180deg)" }} />,
    },
    { type: ControlType.NEXT, el: <PlayArrowIcon fontSize="small" /> },
    { type: ControlType.NEXT2, el: <FastForwardIcon /> },
    { type: ControlType.LAST, el: <SkipNextIcon /> },
  ];
  return (
    <div style={{ textAlign: "center" }}>
      {icons.map(icon => (
        <IconButton onClick={() => props.onClick(icon.type)}>{icon.el}</IconButton>
      ))}
    </div>
  );
};

export default GameControlPanel;
