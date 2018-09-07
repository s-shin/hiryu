/// <reference types="node" />
import { ChildProcess } from "child_process";
import * as readline from "readline";
import { EngineAdapter } from "@hiryu/usi-engine";
export default class NodeEngineAdapter extends EngineAdapter {
    private binPath;
    process?: ChildProcess;
    rl?: readline.ReadLine;
    constructor(binPath: string);
    start(): void;
    writeln(line: string): void;
    exit(): void;
}
