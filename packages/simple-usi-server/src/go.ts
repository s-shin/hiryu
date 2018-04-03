import * as usi from "@hiryu/usi";
import { engineProcessPool } from "./engine_process_pool";
import { EventListenerPool } from "@hiryu/eventemitter-util";

export interface GoResult {
  bestmove: string;
  details: usi.Info[];
}

export async function go(opts: {
  engineName: string;
  state: string;
  moves: string;
  timeout: number;
}): Promise<GoResult> {
  const proc = await engineProcessPool.aquire(opts.engineName);
  if (!proc) {
    throw new Error("failed to aquire");
  }
  if (proc.state !== usi.EngineState.IS_READY) {
    throw new Error("invalid engine state");
  }

  const listenerPool = new EventListenerPool();

  try {
    const result = await new Promise<GoResult>((resolve, reject) => {
      let bestmove = "";
      const details: usi.Info[] = [];
      let shouldCaptureInfo = false;

      const timeoutID = setTimeout(() => {
        proc.stop(); // => bestmove
      }, opts.timeout * 1000);

      listenerPool.listen(proc, "error", (err: Error) => {
        clearTimeout(timeoutID);
        reject(err);
      });

      listenerPool.listen(proc, "ready", () => {
        clearTimeout(timeoutID);
        resolve({ bestmove, details });
      });

      listenerPool.listen(proc, "info", (info: usi.Info) => {
        if (shouldCaptureInfo) {
          details.push(info);
        }
      });

      listenerPool.listen(proc, "bestmove", (move: string) => {
        bestmove = move;
        shouldCaptureInfo = false;
        proc.gameOver("lose");
        proc.newGame(); // => ready
      });

      proc.setGameState(opts.state, opts.moves);
      shouldCaptureInfo = true;
      proc.go({
        ...usi.DEFAULT_GO_OPTIONS,
        infinite: true,
      }); // => info
    });

    return result;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    listenerPool.dispose();
    engineProcessPool.release(proc);
  }
}
