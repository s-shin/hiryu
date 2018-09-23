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
import { Pane, PaneHeader, PaneBody, colors } from "./components/common";
import LoadRecordDialog from "./components/LoadRecordDialog";
import * as tree from "./utils/tree";
import RecordEventList from "./components/RecordEventList";
import GameControlPanel, { ControlType } from "./components/GameControlPanel";
import AnalysisResult from "./components/AnalysisResult";

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
  padding: 1em 0;
`;

const styles = {
  firstColumn: {
    height: "calc(100vh - 48px)"
  },
  column: {
    borderLeft: `1px solid ${colors.border}`;
    height: "calc(100vh - 48px)"
  },
};

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
              Go
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
            <Grid container direction="column" style={{ ...styles.firstColumn, width: 320 }}>
              <Grid item>
                <Grid container justify="center">
                  <Grid item style={{ padding: "20px 0" }}>
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid item style={{ borderTop: `solid ${colors.border} 1px` }}>
                <GameControlPanel
                  isFirst={tree.isRoot(this.state.currentGameNode)}
                  isLast={tree.isLeaf(this.state.currentGameNode)}
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
                        node = tree.findAlongRoute(
                          node,
                          [],
                          (n, i) => n.children.length === 0 || i === 10,
                        )!;
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
              <Grid item xs style={{ borderTop: `solid ${colors.border} 1px`, overflow: "auto" }}>
                <AnalysisResult />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <div style={{ ...styles.column, overflow: "auto" }}>
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
            </div>
          </Grid>
          <Grid item xs>
            <Grid container direction="column" style={{ ...styles.column }}>
              <Grid item>
                <Pane>
                  <PaneHeader>Engine</PaneHeader>
                  <PaneBody>{enginePanel}</PaneBody>
                </Pane>
              </Grid>
              <Grid item xs>
                <Pane style={{ height: "100%" }}>
                  <PaneHeader>Log</PaneHeader>
                  <PaneBody style={{ overflow: "auto" }}>
                    <LogView entries={this.props.engineState.log} />
                  </PaneBody>
                </Pane>
              </Grid>
            </Grid>
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
