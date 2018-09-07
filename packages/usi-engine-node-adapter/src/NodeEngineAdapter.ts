import { spawn, ChildProcess } from "child_process";
import * as readline from "readline";
import { EngineAdapter } from "@hiryu/usi-engine";

export default class NodeEngineAdapter extends EngineAdapter {
  process?: ChildProcess;
  rl?: readline.ReadLine;

  constructor(private binPath: string) {
    super();
  }

  start() {
    if (this.process || this.rl) {
      this.onError(new Error("process is running"));
      return;
    }

    this.process = spawn(this.binPath);

    this.rl = readline.createInterface({
      input: this.process.stdout,
    });

    this.rl.on("line", (line: string) => {
      this.onReadLine(line);
    });

    this.process.on("error", (err: Error) => {
      this.onError(err);
    });

    this.process.on("exit", (code: number, signal: string) => {
      this.process = undefined;
      this.rl = undefined;
      this.onAfterExit();
    });

    this.debug("process is ready");
    this.onReady();
  }

  writeln(line: string) {
    if (!this.process) {
      this.onError(new Error("process is not ready"));
      return;
    }
    this.process.stdin.write(`${line}\n`, "utf8");
  }

  exit() {
    if (!this.process) {
      this.onError(new Error("process is not ready"));
      return;
    }
    if (this.process.killed) {
      this.process = undefined;
      this.rl = undefined;
      return this.onAfterExit();
    }
    this.onBeforeExit();
    this.process.kill();
  }
}
