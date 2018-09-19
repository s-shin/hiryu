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
  gameNode: som.rules.standard.GameNode;
  isLoadRecordDialogOpened: boolean;
}

const GameWrapper = styled.div`
  padding: 0.5em;
`;

const EnginePane = styled.div`
  height: calc(100vh - 48px);
  border-left: 1px solid #ccc;
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
    gameNode: som.rules.standard.newRootGameNode(),
    isLoadRecordDialogOpened: true,
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
                      state: this.state.gameNode.state,
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
                  this.setState({ ...this.state, isLoadRecordDialogOpened: false })
                  if (result) {
                    let node = result.rootGameNode;
                    while (node.children.length > 0) {
                      node = node.children[0];
                    }
                    this.setState({ ...this.state, gameNode: node });
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
            <GameWrapper>
              <InteractableGame
                gameNode={this.state.gameNode}
                onMoveEvent={e => {
                  const next = som.rules.standard.applyEvent(this.state.gameNode, e);
                  if (next.violations.length > 0) {
                    return;
                  }
                  this.setState({ ...this.state, gameNode: next });
                }}
              />
            </GameWrapper>
          </Grid>
          <Grid item xs>
            <EnginePane>
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
            </EnginePane>
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
