import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { InteractableGame } from "@hiryu/react-shogi-object-model";
import * as som from "@hiryu/shogi-object-model";
import {
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
import { RootState, EngineState, EnginePhase, AnalysisResults } from "../state";
import { newEngine, newGame, setGameState, go } from "../actions/engine_manager";
import { setCurrentGameNode } from "../actions/game";
import LogView from "../components/LogView";
import EngineSetupForm from "../components/EngineSetupForm";
import EngineConfigurationForm from "../components/EngineConfigurationForm";
import { Pane, PaneHeader, PaneBody, colors } from "../components/common";
import LoadRecordDialog from "../components/LoadRecordDialog";
import RecordEventList from "../components/RecordEventList";
import GameControlPanel, { ControlType } from "../components/GameControlPanel";
import AnalysisResult from "../components/AnalysisResult";
import * as tree from "../utils/tree";
import { getGameState } from "../utils/usi";
import { GameNode, applyEvent } from "../utils/game";

interface AppOwnProps {
  //
}

interface AppStateProps {
  engineState: EngineState;
  currentGameNode: GameNode;
  analysisResults: AnalysisResults;
}

interface AppDispatchProps {
  newEngine: typeof newEngine;
  newGame: typeof newGame;
  setGameState: typeof setGameState;
  go: typeof go;
  setCurrentGameNode: typeof setCurrentGameNode;
}

type AppProps = AppOwnProps & AppStateProps & AppDispatchProps;

interface AppState {
  isLoadRecordDialogOpened: boolean;
}

const Container = styled.div`
  display: grid;
  height: 100vh;
  grid-template:
    "h  h  h " 48px
    "c1 c2 c3" calc(100vh - 48px)
    / 320px auto 1fr;
`;

const Header = styled.div`
  grid-area: h;
`;

const Column1 = styled.div`
  grid-area: c1;
  display: grid;
  height: 100%;
  grid-template:
    "." auto
    "." auto
    "." 1fr
    / auto;
`;

const Column2 = styled.div`
  grid-area: c2;
  border: 0 solid ${colors.border}
  border-width: 0 1px;
  display: grid;
  height: 100%;
`;

const Column3 = styled.div`
  grid-area: c3;
  display: grid;
  height: 100%;
  grid-template:
    "." auto
    "." 1fr
    / auto;
`;

const MainAppBar = withStyles({
  root: {
    boxShadow: "none",
  },
})(AppBar);

class App extends React.Component<AppProps, AppState> {
  state = {
    isLoadRecordDialogOpened: false,
  };

  render() {
    const { engineState, currentGameNode, analysisResults } = this.props;

    // TODO: devide into component or container
    let enginePanel;
    switch (engineState.phase) {
      case EnginePhase.INIT:
      case EnginePhase.SETTING_UP_ENGINE: {
        enginePanel = (
          <EngineSetupForm
            onSubmit={url => this.props.newEngine(url)}
            connecting={engineState.phase === EnginePhase.SETTING_UP_ENGINE}
          />
        );
        break;
      }
      case EnginePhase.CONFIGURATION: {
        enginePanel = (
          <EngineConfigurationForm
            engineOptions={engineState.engineInfo!.options}
            onSubmit={() => this.props.newGame(engineState.engineId!)}
          />
        );
        break;
      }
      case EnginePhase.PREPARING_GAME: {
        enginePanel = <LinearProgress />;
        break;
      }
      case EnginePhase.SET_GAME_STATE: {
        // TODO: form of go options
        enginePanel = (
          <div>
            <Button
              onClick={() => {
                const gs = getGameState(currentGameNode);
                this.props.setGameState(engineState.engineId!, gs.state, gs.moves);
                this.props.go(engineState.engineId!);
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

    const views = {
      appBar: (
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
                  this.props.setCurrentGameNode(result.rootGameNode);
                }
              }}
            />
          </Toolbar>
        </MainAppBar>
      ),
      game: (
        <InteractableGame
          gameNode={this.props.currentGameNode}
          onMoveEvent={e => {
            const next = applyEvent(currentGameNode, e);
            if (next.violations.length > 0) {
              return;
            }
            tree.appendChild(currentGameNode, next);
            this.props.setCurrentGameNode(next);
          }}
        />
      ),
      gameCtrl: (
        <GameControlPanel
          isFirst={tree.isRoot(currentGameNode)}
          isLast={tree.isLeaf(currentGameNode)}
          onClick={type => {
            let node = currentGameNode;
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
            this.props.setCurrentGameNode(node);
          }}
        />
      ),
      analysis: (
        <AnalysisResult
          result={analysisResults[currentGameNode.id] || {}}
          // TODO: invert logic
          invertScore={currentGameNode.state.nextTurn === som.Color.WHITE}
        />
      ),
      record: (
        <RecordEventList
          current={currentGameNode}
          route={undefined}
          onSelect={node => {
            this.props.setCurrentGameNode(node);
          }}
        />
      ),
      engine: (
        <Pane>
          <PaneHeader>Engine</PaneHeader>
          <PaneBody>{enginePanel}</PaneBody>
        </Pane>
      ),
      log: (
        <Pane>
          <PaneHeader>Log</PaneHeader>
          <PaneBody style={{ overflow: "auto" }}>
            <LogView entries={this.props.engineState.log} />
          </PaneBody>
        </Pane>
      ),
    };

    return (
      <Container>
        <Header>{views.appBar}</Header>
        <Column1>
          <div style={{ display: "flex", justifyContent: "center", padding: "17px 0" }}>
            {views.game}
          </div>
          <div style={{ border: `0 solid ${colors.border}`, borderWidth: "1px 0" }}>
            {views.gameCtrl}
          </div>
          <div style={{ overflow: "auto" }}>{views.analysis}</div>
        </Column1>
        <Column2>
          <div style={{ overflow: "auto" }}>{views.record}</div>
        </Column2>
        <Column3>
          {views.engine}
          {views.log}
        </Column3>
      </Container>
    );
  }
}

export default connect<AppStateProps, AppDispatchProps, {}, RootState>(
  state => ({
    engineState: state.engine,
    currentGameNode: state.game.currentGameNode,
    analysisResults: state.game.analysisResults,
  }),
  { newEngine, newGame, setGameState, go, setCurrentGameNode },
)(App);
