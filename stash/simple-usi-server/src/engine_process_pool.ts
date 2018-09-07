import { NodeEngineProcess } from "@hiryu/node-usi";
import { EventListenerPool } from "@hiryu/eventemitter-util";
import { pathFilter, mustBeSupportedEngine, getEngineConfig, getEngineProcessPoolConfig } from "./config";

export class EngineProcessEntry {
  constructor(
    public id: number,
    public engineName: string,
    public process: NodeEngineProcess,
    public isLocked: boolean,
  ) {}

  toString() {
    return `EngineProcessEntry[${this.id}]`;
  }
}

export class EngineProcessPool {
  lastId = 0;
  entries: EngineProcessEntry[] = [];

  async aquire(engineName: string): Promise<NodeEngineProcess | undefined> {
    mustBeSupportedEngine(engineName);
    const poolConfig = getEngineProcessPoolConfig(engineName);
    const targetEntries = this.entries.filter(entry => {
      return entry.engineName === engineName;
    });
    {
      const found = targetEntries.find(entry => {
        return !entry.isLocked;
      });
      if (found) {
        found.isLocked = true;
        return found.process;
      }
    }
    if (targetEntries.length < poolConfig.limit) {
      const entry = await this.createEntry(engineName);
      entry.isLocked = true;
      return entry.process;
    }
  }

  release(engineProcess: NodeEngineProcess) {
    const found = this.entries.find(entry => {
      return entry.process === engineProcess;
    });
    if (!found) {
      return;
    }
    found.isLocked = false;
  }

  private async createEntry(engineName: string): Promise<EngineProcessEntry> {
    mustBeSupportedEngine(engineName);
    const engineConfig = getEngineConfig(engineName);
    const engineProcess = new NodeEngineProcess(pathFilter(engineConfig.path));

    const newEntry = new EngineProcessEntry(
      ++this.lastId,
      engineName,
      engineProcess,
      true,
    );
    this.entries.push(newEntry);

    engineProcess.on("exit", () => {
      this.entries = this.entries.filter(entry => {
        return entry !== newEntry;
      });
    });

    engineProcess.on("debug", msg => {
      console.log(`${newEntry}: debug: ${msg}`);
    });

    const listenerPool = new EventListenerPool();

    try {
      await new Promise((resolve, reject) => {
        listenerPool.listen(engineProcess, "error", (err: Error) => {
          console.log(`${newEntry}: error: ${err}`);
          reject(err);
        });
        listenerPool.listen(engineProcess, "configure", () => {
          engineProcess.newGame();
        });
        listenerPool.listen(engineProcess, "ready", () => {
          resolve();
        });
        engineProcess.start();
      });
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      listenerPool.dispose();
    }

    newEntry.isLocked = false;
    return newEntry;
  }
}

export const engineProcessPool = new EngineProcessPool();
