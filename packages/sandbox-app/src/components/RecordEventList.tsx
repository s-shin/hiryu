import React from "react";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";

const EventListItem = styled.span`
  display: inline-block;

  :before {
    display: inline-block;
    content: attr(data-marker) ".";
    margin-right: 0.5em;
    text-align: right;
    width: 2.5em;
  }
`;

export interface RecordEventListProps {
  current: som.rules.standard.GameNode;
  points?: tree.PathPoint[];
  onSelect: (node: som.rules.standard.GameNode, depth: number) => void;
}

export interface RecordEventListState {
  menu: {
    anchorEl: HTMLElement;
    depth: number;
  } | null;
}

class RecordEventList extends React.Component<RecordEventListProps, RecordEventListState> {
  state: RecordEventListState = {
    menu: null,
  };

  render() {
    const items: JSX.Element[] = [];
    const root = tree.getRootNode(this.props.current);
    tree.walkTowardsChild(
      root,
      (node, depth) => {
        const v = tree.getValue(node);
        const event = v.byEvent;
        const isSelected = tree.nodeEquals(this.props.current, node);
        const text =
          !event || tree.isRootNode(node) ? (
            <ListItemText key={depth}>
              <EventListItem data-marker="#">初期局面</EventListItem>
            </ListItemText>
          ) : (
            <ListItemText key={depth}>
              <EventListItem data-marker={depth}>
                {som.formats.ja.stringifyEvent(event)!}
              </EventListItem>
            </ListItemText>
          );
        let action: JSX.Element | undefined;
        const siblings = tree.getSiblings(node);
        if (siblings.length >= 2) {
          const { menu } = this.state;
          action = (
            <ListItemSecondaryAction>
              <IconButton
                style={{ padding: 5, verticalAlign: "baseline" }}
                onClick={e => {
                  this.setState({
                    ...this.state,
                    menu: { anchorEl: e.currentTarget, depth },
                  });
                }}
              >
                <AddIcon style={{ fontSize: 15 }} />
              </IconButton>
              <Menu
                open={Boolean(menu && menu.depth === depth)}
                anchorEl={menu && menu.anchorEl}
                onClose={() => {
                  this.setState({ ...this.state, menu: null });
                }}
              >
                {siblings.map(n => (
                  <MenuItem
                    onClick={() => {
                      this.props.onSelect(n, depth);
                      this.setState({ ...this.state, menu: null });
                    }}
                  >
                    {som.formats.ja.stringifyEvent(tree.getValue(n).byEvent!)!}
                  </MenuItem>
                ))}
              </Menu>
            </ListItemSecondaryAction>
          );
        }
        items.push(
          <ListItem
            key={depth}
            button
            selected={isSelected}
            onClick={() => this.props.onSelect(node, depth)}
            style={{ padding: 10 }}
          >
            {text}
            {action}
          </ListItem>,
        );
        return true;
      },
      { points: this.props.points || this.props.current.path.points },
    );

    return (
      <List dense style={{ width: "10em" }}>
        {items}
      </List>
    );
  }
}

export default RecordEventList;
