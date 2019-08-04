import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { InteractableGame } from "@hiryu/react-shogi-object-model";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";
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
import { RootState, EnginePhase } from "../state";
import * as engineManagerActions from "../actions/engine_manager";
import * as gameActions from "../actions/game";
import LogView from "../components/LogView";
import EngineSetupForm from "../components/EngineSetupForm";
import EngineConfigurationForm from "../components/EngineConfigurationForm";
import EngineGoForm from "../components/EngineGoForm";
import { Pane, PaneHeader, PaneBody, colors } from "../components/common";
import LoadRecordDialog from "../components/LoadRecordDialog";
import RecordEventList from "../components/RecordEventList";
import GameControlPanel, { ControlType } from "../components/GameControlPanel";
import AnalysisResult from "../components/AnalysisResult";
import { newAnalysisResult } from "../utils/game";

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
  border: 0 solid ${colors.border};
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

const App: React.FC = () => {
  const [isLoadRecordDialogOpened, setIsLoadRecordDialogOpened] = useState(false);

  const { engineState, currentGameNode } = useSelector((state: RootState) => ({
    engineState: state.engine,
    currentGameNode: state.game.currentGameNode,
  }));

  const dispatch = useDispatch();

  const currentGameNodeData = tree.getValue(currentGameNode);

  // TODO: devide into component or container
  let enginePanel;
  switch (engineState.phase) {
    case EnginePhase.SETTING_UP_ENGINE: {
      enginePanel = (
        <EngineSetupForm
          onSubmit={url => engineManagerActions.newEngine(url)(dispatch)}
          connecting={engineState.phase === EnginePhase.SETTING_UP_ENGINE}
        />
      );
      break;
    }
    case EnginePhase.CONFIGURATION: {
      enginePanel = (
        <EngineConfigurationForm
          engineOptions={engineState.engineInfo!.options}
          onSubmit={vals => {
            for (const name of Object.keys(vals)) {
              dispatch(engineManagerActions.setOption(engineState.engineId!, name, vals[name]));
            }
            dispatch(engineManagerActions.newGame(engineState.engineId!));
          }}
        />
      );
      break;
    }
    case EnginePhase.PREPARING_GAME: {
      enginePanel = <LinearProgress />;
      break;
    }
    case EnginePhase.SET_GAME_STATE:
    case EnginePhase.GOING: {
      enginePanel = (
        <EngineGoForm
          isGoing={engineState.phase === EnginePhase.GOING}
          onGo={opts => {
            dispatch(engineManagerActions.setGameState(engineState.engineId!, currentGameNode));
            dispatch(engineManagerActions.go(engineState.engineId!, opts));
          }}
          onStop={() => {
            dispatch(engineManagerActions.stop(engineState.engineId!));
          }}
        />
      );
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
          <IconButton color="inherit" aria-label="Menu" style={{ marginLeft: -16, marginRight: 4 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
            Hiryu
          </Typography>
          <Button color="inherit" onClick={() => setIsLoadRecordDialogOpened(true)}>
            <InsertDriveFileIcon style={{ marginRight: 4 }} /> Load Record
          </Button>
          <LoadRecordDialog
            open={isLoadRecordDialogOpened}
            onClose={result => {
              setIsLoadRecordDialogOpened(false);
              if (result) {
                dispatch(gameActions.setCurrentGameNode(result.rootGameNode));
              }
            }}
          />
        </Toolbar>
      </MainAppBar>
    ),
    game: (
      <InteractableGame
        gameNode={currentGameNode}
        onMoveEvent={e => {
          const next = som.rules.standard.applyEvent(currentGameNode, e);
          if (next.violations.length > 0) {
            return;
          }
          dispatch(gameActions.setCurrentGameNode(tree.appendChild(currentGameNode, next)));
        }}
      />
    ),
    gameCtrl: (
      <GameControlPanel
        isFirst={tree.isRootNode(currentGameNode)}
        isLast={tree.isLeafNode(currentGameNode)}
        onClick={type => {
          let node = currentGameNode;
          switch (type) {
            case ControlType.FIRST: {
              node = { tree: node.tree, path: tree.ROOT_PATH };
              break;
            }
            case ControlType.PREV2: {
              node = tree.findParentNode(node, (n, i) => tree.isRootNode(n) || i === 10)!;
              break;
            }
            case ControlType.PREV: {
              node = tree.getParentNode(node) || node;
              break;
            }
            case ControlType.NEXT: {
              // TODO: route
              node = tree.getChildNodes(node)[0] || node;
              break;
            }
            case ControlType.NEXT2: {
              // TODO: route
              node = tree.findChildNode(node, (n, i) => tree.isLeafNode(n) || i === 10)!;
              break;
            }
            case ControlType.LAST: {
              // TODO: route
              node = tree.getLeafNode(node.tree, []);
              break;
            }
          }
          dispatch(gameActions.setCurrentGameNode(node));
        }}
      />
    ),
    analysis: (
      <AnalysisResult
        result={engineState.analysisResults[currentGameNodeData.id] || newAnalysisResult()}
      />
    ),
    record: (
      <RecordEventList
        current={currentGameNode}
        points={undefined} // TODO
        onSelect={node => {
          dispatch(gameActions.setCurrentGameNode(node));
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
          <LogView entries={engineState.log} />
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
};

export default App;
