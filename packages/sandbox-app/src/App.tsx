import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { InteractableGame } from "@hiryu/react-shogi-object-model";
import * as som from "@hiryu/shogi-object-model";
import {
  Grid,
  LinearProgress,
  Button,
  AppBar,
  IconButton,
  Typography,
  Toolbar,
  withStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { RootState, EngineState, EnginePhase } from "./state";
import { newEngine, newGame, setGameState, go } from "./actions/engine_manager";
import LogView from "./components/LogView";
import EngineSetupForm from "./components/EngineSetupForm";
import EngineConfigurationForm from "./components/EngineConfigurationForm";
import EngineGameForm from "./components/EngineGameForm";
import { Panel, PanelHeader, PanelBody } from "./components/common";
import LoadRecordDialog from "./components/LoadRecordDialog";
import * as tree from "./utils/tree";
import RecordEventList from "./components/RecordEventList";
import GameControlPanel, { ControlType } from "./components/GameControlPanel";

interface AppOwnProps {
  //
}

interface AppStateProps {
  engineState: EngineState;
}

interface AppDispatchProps {
  newEngine: typeof newEngine;
  newGame: typeof newGame;
  setGameState: typeof setGameState;
  go: typeof go;
}

type AppProps = AppOwnProps & AppStateProps & AppDispatchProps;

interface AppState {
  currentGameNode: som.rules.standard.GameNode;
  isLoadRecordDialogOpened: boolean;
}

const GameWrapper = styled.div`
  padding: 1em 0.75em;
`;

const Pane = styled.div`
  height: calc(100vh - 48px);
  border-left: 1px solid #ccc;
  overflow: auto;
`;

const EnginePaneSection = styled.div`
  border-bottom: 1px solid #ddd;
`;

const EnginePaneLogViewSection = styled(EnginePaneSection)`
  background-color: #eee;
`;

const MainAppBar = withStyles({
  root: {
    boxShadow: "none",
  },
})(AppBar);

class App extends React.Component<AppProps, AppState> {
  state = {
    currentGameNode: som.rules.standard.newRootGameNode(),
    isLoadRecordDialogOpened: false,
  };

  render() {
    let enginePanel;
    switch (this.props.engineState.phase) {
      case EnginePhase.NONE:
      case EnginePhase.SETTING_UP_ENGINE: {
        enginePanel = (
          <EngineSetupForm
            onSubmit={url => this.props.newEngine(url)}
            connecting={this.props.engineState.phase === EnginePhase.SETTING_UP_ENGINE}
          />
        );
        break;
      }
      case EnginePhase.CONFIGURATION: {
        enginePanel = (
          <EngineConfigurationForm
            engineOptions={this.props.engineState.engineInfo!.options}
            onSubmit={() => this.props.newGame(this.props.engineState.engineId!)}
          />
        );
        break;
      }
      case EnginePhase.PREPARING_GAME: {
        enginePanel = <LinearProgress />;
        break;
      }
      case EnginePhase.SET_GAME_STATE: {
        enginePanel = (
          <div>
            <EngineGameForm
              onSubmit={p =>
                this.props.setGameState(this.props.engineState.engineId!, p.state, p.moves)
              }
            />
            <Button
              onClick={() => {
                this.props.go(this.props.engineState.engineId!);
              }}
            >
              Go
            </Button>
            <Button
              onClick={() => {
                this.props.setGameState(
                  this.props.engineState.engineId!,
                  "sfen " +
                    som.formats.usi.stringifySFEN({
                      nextMoveNum: 1,
                      state: this.state.currentGameNode.state,
                    }),
                  "",
                );
                this.props.go(this.props.engineState.engineId!);
              }}
            >
              Go with current state.
            </Button>
          </div>
        );
        break;
      }
      case EnginePhase.GOING: {
        enginePanel = <LinearProgress />;
        break;
      }
      default: {
        enginePanel = <div>TODO</div>;
        break;
      }
    }

    return (
      <Grid container direction="column">
        <Grid item>
          <MainAppBar position="sticky">
            <Toolbar variant="dense">
              <IconButton
                color="inherit"
                aria-label="Menu"
                style={{ marginLeft: -16, marginRight: 4 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" style={{ flexGrow: 1 }}>
                Hiryu
              </Typography>
              <Button
                color="inherit"
                onClick={() => this.setState({ ...this.state, isLoadRecordDialogOpened: true })}
              >
                <InsertDriveFileIcon style={{ marginRight: 4 }} /> Load Record
              </Button>
              <LoadRecordDialog
                open={this.state.isLoadRecordDialogOpened}
                onClose={result => {
                  this.setState({ ...this.state, isLoadRecordDialogOpened: false });
                  if (result) {
                    // let node = result.rootGameNode;
                    // while (node.children.length > 0) {
                    //   node = node.children[0];
                    // }
                    this.setState({ ...this.state, currentGameNode: result.rootGameNode });
                  }
                }}
              />
            </Toolbar>
          </MainAppBar>
        </Grid>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          alignContent="stretch"
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <GameWrapper>
                  <InteractableGame
                    gameNode={this.state.currentGameNode}
                    onMoveEvent={e => {
                      const next = som.rules.standard.applyEvent(this.state.currentGameNode, e);
                      if (next.violations.length > 0) {
                        return;
                      }
                      tree.appendChild(this.state.currentGameNode, next);
                      this.setState({ ...this.state, currentGameNode: next });
                    }}
                  />
                </GameWrapper>
              </Grid>
              <Grid item xs>
                <GameControlPanel
                  onClick={type => {
                    let node = this.state.currentGameNode;
                    switch (type) {
                      case ControlType.FIRST: {
                        node = tree.getRootNode(node);
                        break;
                      }
                      case ControlType.PREV2: {
                        node = tree.findParent(node, (n, i) => !n.parent || i === 10)!;
                        break;
                      }
                      case ControlType.PREV: {
                        node = node.parent || node;
                        break;
                      }
                      case ControlType.NEXT: {
                        // TODO: child index
                        node = node.children[0] || node;
                        break;
                      }
                      case ControlType.NEXT2: {
                        // TODO: route
                        node = tree.findAlongRoute(node, [], (n, i) => n.children.length === 0 || i === 10)!;
                        break;
                      }
                      case ControlType.LAST: {
                        // TODO: route
                        node = tree.getLeafNode(node, []);
                        break;
                      }
                    }
                    this.setState({ ...this.state, currentGameNode: node });
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Pane>
              <RecordEventList
                current={this.state.currentGameNode}
                route={undefined}
                onSelect={node => {
                  this.setState({
                    ...this.state,
                    currentGameNode: node,
                  });
                }}
              />
            </Pane>
          </Grid>
          <Grid item xs>
            <Pane>
              <Grid container direction="column" style={{ height: "100%" }}>
                <Grid item>
                  <Panel>
                    <PanelHeader>Engine</PanelHeader>
                    <PanelBody>{enginePanel}</PanelBody>
                  </Panel>
                </Grid>
                <Grid item xs>
                  <Panel style={{ height: "100%" }}>
                    <PanelHeader>Log</PanelHeader>
                    <PanelBody style={{ overflow: "auto" }}>
                      <LogView entries={this.props.engineState.log} />
                    </PanelBody>
                  </Panel>
                </Grid>
              </Grid>
            </Pane>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default connect<AppStateProps, AppDispatchProps, {}, RootState>(
  state => ({
    engineState: state.engine,
  }),
  { newEngine, newGame, setGameState, go },
)(App);
