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
  isFirst: boolean;
  isLast: boolean;
  onClick: (type: ControlType) => void;
}

const GameControlPanel: React.SFC<GameControlPanelProps> = props => {
  const icons = [
    { type: ControlType.FIRST, disabled: props.isFirst, el: <SkipPreviousIcon /> },
    { type: ControlType.PREV2, disabled: props.isFirst, el: <FastRewindIcon /> },
    {
      type: ControlType.PREV,
      disabled: props.isFirst,
      el: <PlayArrowIcon fontSize="small" style={{ transform: "rotate(180deg)" }} />,
      padding: 14,
    },
    {
      type: ControlType.NEXT,
      disabled: props.isLast,
      el: <PlayArrowIcon fontSize="small" />,
      padding: 14,
    },
    { type: ControlType.NEXT2, disabled: props.isLast, el: <FastForwardIcon /> },
    { type: ControlType.LAST, disabled: props.isLast, el: <SkipNextIcon /> },
  ];
  return (
    <div style={{ textAlign: "center" }}>
      {icons.map((icon, i) => (
        <IconButton
          key={i}
          onClick={() => props.onClick(icon.type)}
          disabled={icon.disabled}
          style={{
            padding: icon.padding,
          }}
        >
          {icon.el}
        </IconButton>
      ))}
    </div>
  );
};

export default GameControlPanel;
