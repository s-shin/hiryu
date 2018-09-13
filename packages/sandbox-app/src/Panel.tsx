import React from "react";

interface PanelProps {
  title: string;
}

const Panel: React.SFC<PanelProps> = props => {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        {props.children}
      </div>
    </div>
  );
};

export default Panel;
