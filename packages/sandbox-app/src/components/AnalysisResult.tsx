import React from "react";
import styled from "styled-components";
import { List, ListItem } from "@material-ui/core";

const Item = styled.div`
  font-size: 0.8em;
  border-bottom: 1px solid #ccc;
`;

const Score = styled.span`
  display: inline-block;
  padding: 0.2em 0.5em;
  background-color: #333;
  color: #fff;
`;

const Move = styled.span`
  display: inline-block;
  margin: 0 0.2em;
`;

const AnalysisResult = props => {
  return (
    <div>
      <Item>
        <Score>+460</Score>
        <Move><b>６五角</b></Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
      </Item>
      <Item>
        <Score>+460</Score>
        <Move><b>６五角</b></Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
      </Item>
      <Item>
        <Score>+460</Score>
        <Move><b>６五角</b></Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
        <Move>６五角</Move>
      </Item>
    </div>
  );
};

export default AnalysisResult;
