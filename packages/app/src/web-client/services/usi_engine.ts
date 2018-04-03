// tslint:disable no-implicit-dependencies
import io from "socket.io-client";
import * as usi from "@hiryu/usi";
import { EventListenerPool } from "@hiryu/eventemitter-util";
import * as usiEngineService from "../../common/services/usi_engine";
import * as wsAPI from "../../web-common/ws_api";
import { must } from "../../common/utils/must";

class Service implements usiEngineService.API {
  isInitialized = false;
  socket?: SocketIOClient.Socket;

  constructor(
    public uri: string,
  ) {}

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    const elp = new EventListenerPool();
    try {
      await new Promise((resolve, reject) => {
        this.socket = io.connect(this.uri);

        elp.listen(this.socket, "connect", () => {
          resolve();
        });

        elp.listen(this.socket, "error", () => {
          this.socket!.disconnect();
          reject();
        });
      });
      this.isInitialized = true;
    } finally {
      elp.dispose();
    }
  }

  async destroy() {
    must(this.socket).disconnect();
    this.isInitialized = false;
  }

  newGame() {
    return new Promise<void>((resolve, reject) => {
      const req: wsAPI.NewGameRequest = { engine: "apery" };
      must(this.socket).emit(wsAPI.Name.REQ_NEW_GAME, req, (res: wsAPI.NewGameResponse) => {
        if (res.error) {
          return reject(res.error);
        }
        resolve();
      });
    });
  }

  setGameState(state: string, moves: string) {
    return new Promise<void>((resolve, reject) => {
      const req: wsAPI.SetGameStateRequest = { state, moves };
      must(this.socket).emit(wsAPI.Name.REQ_SET_GAME_STATE, req, (res: wsAPI.SetGameStateResponse) => {
        if (res.error) {
          return reject(res.error);
        }
        resolve();
      });
    });
  }

  go(options: usi.GoOptions) {
    return new Promise<void>((resolve, reject) => {
      const req: wsAPI.GoRequest = { options };
      must(this.socket).emit(wsAPI.Name.REQ_GO, req, (res: wsAPI.GoResponse) => {
        if (res.error) {
          return reject(res.error);
        }
        resolve();
      });
    });
  }

  stop() {
    return new Promise<void>((resolve, reject) => {
      const req: wsAPI.StopRequest = undefined;
      must(this.socket).emit(wsAPI.Name.REQ_GO, req, (res: wsAPI.StopResponse) => {
        if (res.error) {
          return reject(res.error);
        }
        resolve();
      });
    });
  }

  on(type: "info", cb: (info: usi.Info) => void): void;
  on(type: "bestmove", cb: (move: usi.BestMove) => void): void;
  on(name: "error", cb: (err: Error) => void): void;
  on(type: string, cb: any) {
    switch (type) {
      case "info": {
        return must(this.socket).on(wsAPI.Name.NOTI_INFO, (data: wsAPI.InfoNotification) => {
          cb(data.info);
        });
      }
      case "bestmove": {
        return must(this.socket).on(wsAPI.Name.NOTI_BEST_MOVE, (data: wsAPI.BestMoveNotification) => {
          cb(data.move);
        });
      }
      case "error": {
        return must(this.socket).on(wsAPI.Name.NOTI_ERROR, (data: wsAPI.ErrorNotification) => {
          cb(data.error);
        });
      }
    }
  }

  off(name: "info", cb: (info: usi.Info) => void): void;
  off(name: "bestmove", cb: (move: usi.BestMove) => void): void;
  off(name: "error", cb: (err: Error) => void): void;
  off(name: string, cb: any) {
    must(this.socket).off(name, cb);
  }
}

// TODO: url
usiEngineService.provider.setService(new Service("http://localhost:3000/"));
