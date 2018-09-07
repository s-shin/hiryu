import process from "process";
import config from "config";
import * as configSpec from "../common/config_spec";
import * as usi from "@hiryu/usi";
import * as wsAPI from "../web-common/ws_api";
import { NodeEngineProcess } from "@hiryu/node-usi";
import { logger } from "./logger";

export function setup(io: SocketIO.Server) {
  io.on("connection", socket => {
    logger.info(`new connection: ${socket.id}`);

    let engine: NodeEngineProcess | undefined;

    socket.on("error", (err: Error) => {
      logger.error(err);
    });

    socket.on("disconnect", (reason: string) => {
      logger.info(`disconnect: ${reason}`);
      if (engine) {
        engine.quit();
        engine = undefined;
      }
    });

    socket.on(wsAPI.Name.REQ_NEW_GAME, (req: wsAPI.NewGameRequest, cb: (res: wsAPI.NewGameResponse) => void) => {
      if (engine) {
        cb({ error: { reason: "game already actived" } });
        return;
      }

      const engineConfigKey = `engines.${req.engine}`;
      if (!config.has(engineConfigKey)) {
        cb({ error: { reason: "unknown engine" } });
        return;
      }
      const engineConfig = config.get<configSpec.EngineConfig>(engineConfigKey);

      engine = new NodeEngineProcess(engineConfig.path.replace("$HOME", process.env.HOME || ""));

      engine.on("debug", (msg: string, ...args: any[]) => {
        logger.debug(`engine: debug: ${msg}`, { args });
      });

      engine.on("configure", c => {
        logger.info("engine: configure");
        if (!engine) {
          // TODO: never come
          return;
        }
        // TODO: set options
        engine.newGame();
      });

      engine.on("ready", () => {
        logger.info("engine: ready");
        cb({});
      });

      engine.on("info", info => {
        logger.info("engine: info");
        socket.emit(wsAPI.Name.NOTI_INFO, { info });
      });

      engine.on("bestmove", move => {
        logger.info("engine: bestmove");
        socket.emit(wsAPI.Name.NOTI_BEST_MOVE, { move });
      });

      engine.on("error", err => {
        logger.error(`engine: error: ${err}`);
        socket.emit(wsAPI.Name.NOTI_ERROR, { error: err });
      });

      engine.on("exit", () => {
        logger.info("engine: exit");
        engine = undefined;
      });

      engine.start();
    });

    socket.on(wsAPI.Name.REQ_SET_GAME_STATE, (req: wsAPI.SetGameStateRequest, cb: (res: wsAPI.SetGameStateResponse) => void) => {
      if (!engine || engine.state !== usi.EngineState.IS_READY) {
        cb({ error: { reason: "engine is not ready" }});
        return;
      }
      engine.setGameState(req.state, req.moves);
      cb({});
    });

    socket.on(wsAPI.Name.REQ_GO, (req: wsAPI.GoRequest, cb: (res: wsAPI.GoResponse) => void) => {
      if (!engine || engine.state !== usi.EngineState.IS_READY) {
        cb({ error: { reason: "engine is not ready" }});
        return;
      }
      engine.go(req.options);
      cb({});
    });

    socket.on(wsAPI.Name.REQ_STOP, (req: wsAPI.StopRequest, cb: (res: wsAPI.StopResponse) => void) => {
      if (!engine || engine.state !== usi.EngineState.IS_READY) {
        cb({ error: { reason: "engine is not ready" }});
        return;
      }
      engine.stop();
      cb({});
    });
  });
}
