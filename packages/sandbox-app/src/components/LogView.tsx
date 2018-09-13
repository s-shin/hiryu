import React from "react";
import styled from "styled-components";
import { LogEntry, LogLevel } from "../state";

const Line = styled.p`
  margin: 0px;
  padding: 0px;
  line-height: 1.5;
  font-size: 0.6em;
  font-family: Menlo, "Source Code Pro", monospace;
`;

interface LogViewProps {
  entries: LogEntry[];
}

const LogView: React.SFC<LogViewProps> = props => {
  return (
    <React.Fragment>
      {props.entries.length === 0 && <Line>(empty)</Line>}
      {props.entries.map((ent, i) => (
        <Line key={i}>
          {ent.date.toISOString()} {LogLevel[ent.level]} {ent.message}
        </Line>
      ))}
    </React.Fragment>
  );
};

export default LogView;
