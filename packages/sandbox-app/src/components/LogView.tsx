import React from "react";
import styled, { css } from "styled-components";
import { LogEntry, LogLevel } from "../state";

const level2color = {
  [LogLevel.TRACE]: css`
    color: inherit;
  `,
  [LogLevel.DEBUG]: css`
    color: inherit;
  `,
  [LogLevel.INFO]: css`
    color: #0f0;
  `,
  [LogLevel.WARN]: css`
    color: #aa0;
    font-weight: bold;
  `,
  [LogLevel.ERROR]: css`
    color: #f00;
    font-weight: bold;
  `,
  [LogLevel.FATAL]: css`
    color: #f00;
    font-weight: bold;
  `,
};

const Line = styled<{ level?: LogLevel }, "p">("p")`
  margin: 0px;
  padding: 0px;
  line-height: 1.5;
  font-size: 0.6em;
  font-family: Menlo, "Source Code Pro", monospace;
  ${props => props.level && level2color[props.level]};
`;

interface LogViewProps {
  entries: LogEntry[];
}

const LogView: React.SFC<LogViewProps> = props => {
  return (
    <React.Fragment>
      {props.entries.length === 0 && <Line>(empty)</Line>}
      {props.entries.map((ent, i) => (
        <Line key={i} level={ent.level}>
          {ent.date.toISOString()} {LogLevel[ent.level]} {ent.message}
        </Line>
      ))}
    </React.Fragment>
  );
};

export default LogView;
