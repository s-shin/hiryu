import React from "react";
import styled, { css } from "styled-components";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";
import { Score, ScoreType } from "@hiryu/usi-engine";
import { AnalysisResult } from "../utils/game";

const Item = styled.div`
  font-size: 0.8em;
  border-bottom: 1px solid #ccc;
  background-color: #eef;
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
}

function stringifyScore(score?: Score, invert: boolean = false): number | string {
  if (!score) {
    return "?";
  }
  switch (score.type) {
    case ScoreType.CP: {
      return score.value * (invert ? -1 : 1);
    }
    case ScoreType.MATE: {
      const valueStr = (() => {
        if (score.value === "+") {
          return invert ? "-?" : "+?";
        }
        if (score.value === "-") {
          return invert ? "+?" : "-?";
        }
        if (score.value > 0) {
          return `${invert ? "-" : "+"}${score.value}`;
        }
        return `${invert ? "+" : "-"}${score.value}`;
      })();
      return `Mate ${valueStr}`;
    }
  }
  return "?";
}

const AnalysisResult: React.SFC<AnalysisResultProps> = props => {
  const items = props.result.variations.map((variation, i) => {
    const moves: JSX.Element[] = [];
    const data = tree.getValue(variation.startGameNode);
    const event = data.byEvent!;
    tree.walkTowardsChild(
      variation.startGameNode,
      (node, i) => {
        const v = tree.getValue(node);
        moves.push(
          <Move key={i} bold={i === 0}>
            {som.formats.ja.stringifyEvent(v.byEvent!)}
          </Move>,
        );
        return true;
      },
      { points: variation.startGameNode.path.points },
    );
    return (
      <Item key={i}>
        <Score key="score">
          {stringifyScore(variation.rawInfo.score, event.color === som.Color.WHITE)}
        </Score>
        {moves}
      </Item>
    );
  });
  return <div>{items}</div>;
};

export default AnalysisResult;
