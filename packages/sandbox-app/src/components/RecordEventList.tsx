import React from "react";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "../utils/tree";
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
  route?: tree.Route<som.rules.standard.GameNode>;
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
    const rr = tree.getNodeInfo(this.props.current);
    tree.traverseRoute(rr.root, this.props.route || rr.route, (node, depth) => {
      const parent = node.parent;
      const event = node.byEvent;
      const isSelected = this.props.current === node;
      const text =
        !event || !parent ? (
          <ListItemText>
            <EventListItem data-marker="#">初期局面</EventListItem>
          </ListItemText>
        ) : (
          <ListItemText>
            <EventListItem data-marker={depth}>
              {som.formats.ja.stringifyEvent(event)!}
            </EventListItem>
          </ListItemText>
        );
      let action: JSX.Element | undefined;
      if (parent && parent.children.length >= 2) {
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
              {parent.children.map(n => (
                <MenuItem
                  onClick={() => {
                    this.props.onSelect(n, depth);
                    this.setState({ ...this.state, menu: null });
                  }}
                >
                  {som.formats.ja.stringifyEvent(n.byEvent!)!}
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
          style={{padding: 10}}
        >
          {text}
          {action}
        </ListItem>,
      );
    });

    return (
      <List dense style={{ width: "10em" }}>
        {items}
      </List>
    );
  }
}

export default RecordEventList;
