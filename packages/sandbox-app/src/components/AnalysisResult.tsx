import React from "react";
import styled, { css } from "styled-components";
import { Info } from "@hiryu/usi-engine";
import * as som from "@hiryu/shogi-object-model";
import { AnalysisResult } from "../utils/game";

const Item = styled.div`
  font-size: 0.8em;
  border-bottom: 1px solid #ccc;
`;

const Score = styled.span`
  display: inline-block;
  padding: 0.2em 0.5em;
  margin: 0 0.2em 0 0;
  background-color: #333;
  color: #fff;
  font-weight: bold;
`;

const Move = styled<{ bold: boolean }, "span">("span")`
  display: inline-block;
  margin: 0 0.2em;
  ${props =>
    props.bold &&
    css`
      font-weight: bold;
    `};
`;

export interface AnalysisResultProps {
  result: AnalysisResult;
  invertScore: boolean;
}

function stringifyScore(info: Info, invert: boolean): number | string {
  if (info.cp) {
    const t = info.cp.value;
    return invert ? -t : t;
  }
  if (info.mate) {
    // TODO: is_engine_side_mated
    const t = info.mate.num;
    if (t) {
      return invert ? t : -t;
    }
  }
  return "-";
}

function stringifyMove(usiMoveStr: string): string {
  // TODO
  return usiMoveStr;
}

const AnalysisResult: React.SFC<AnalysisResultProps> = props => {
  const items = Object.keys(props.result)
    .map(s => Number(s))
    .sort()
    .map(pvIdx => {
      const info = props.result[pvIdx];
      return (
        <Item key={pvIdx}>
          <Score key="score">{stringifyScore(info, props.invertScore)}</Score>
          {info.pv &&
            info.pv.map((mv, i) => (
              <Move key={`move${i}`} bold={i === 0}>
                {stringifyMove(mv)}
              </Move>
            ))}
        </Item>
      );
    });
  return <div>{items}</div>;
};

export default AnalysisResult;
