import React from "react";
import styled from "styled-components";
import { AnalysisResult } from "../utils/game";

const Item = styled.div`
  font-size: 0.8em;
  border-bottom: 1px solid #ccc;
`;

const Score = styled.span`
  display: inline-block;
  padding: 0.2em 0.5em;
  background-color: #333;
  color: #fff;
  font-weight: bold;
`;

const Move = styled.span`
  display: inline-block;
  margin: 0 0.2em;
`;

export interface AnalysisResultProps {
  result: AnalysisResult;
}

const AnalysisResult: React.SFC<AnalysisResultProps> = props => {
  const items = Object.keys(props.result)
    .map(s => Number(s))
    .sort()
    .map(pvIdx => {
      const info = props.result[pvIdx];
      return (
        <Item>
          <Score>{info.cp ? info.cp.value : info.mate ? info.mate.num : "-"}</Score>
          {info.pv && info.pv.map(mv => <Move>{mv}</Move>)}
        </Item>
      );
    });
  return <div>{items}</div>;
};

export default AnalysisResult;
