import { spawn, ChildProcess } from "child_process";
import * as readline from "readline";
import { Engine } from "@hiryu/usi";

export class NodeEngineProcess extends Engine {
  process: ChildProcess;
  rl: readline.ReadLine;

  constructor(binPath: string) {
    super();

    this.process = spawn(binPath);

    this.rl = readline.createInterface({
      input: this.process.stdout,
    });

    this.rl.on("line", (line: string) => {
      this.parseLine(line);
    });

    this.process.on("error", (err: Error) => {
      this.error(err);
    });

    this.process.on("exit", (code: number, signal: string) => {
      this.afterExit();
    });

    this.debug("process is ready");
    this.processStarted();
  }

  protected writeln(line: string) {
    this.process.stdin.write(`${line}\n`, "utf8");
  }

  protected exit() {
    if (this.process.killed) {
      return this.afterExit();
    }
    this.beforeExit();
    this.process.kill();
  }
}
