import React from "react";
import styled, { css } from "styled-components";
import * as som from "@hiryu/shogi-object-model";
import { Score, ScoreType } from "@hiryu/usi-engine";
import { AnalysisResult } from "../utils/game";
import * as tree from "../utils/tree";

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

function stringifyScore(score?: Score, invert: boolean): number | string {
  if (!score) {
    return "-";
  }
  switch (score.type) {
    case ScoreType.CP: {
      return score.value;
    }
    case ScoreType.MATE: {
      return `Mate ${score.value}`;
    }
  }
  return "-";
}

const AnalysisResult: React.SFC<AnalysisResultProps> = props => {
  const items = props.result.variations.map((variation, i) => {
    const moves: JSX.Element[] = [];
    tree.traverse(variation.gameNode, (node, i) => {
      moves.push(
        <Move key={i} bold={i === 0}>
          {som.formats.ja.stringifyEvent(node.byEvent!)}
        </Move>
      );
      return node.children[0];
    });
    return (
      <Item key={i}>
        <Score key="score">{stringifyScore(variation.rawInfo.score, false)}</Score>
        {moves}
      </Item>
    );
  });
  return <div>{items}</div>;
};

export default AnalysisResult;
