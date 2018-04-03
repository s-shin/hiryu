/// <reference types="node" />
import { ChildProcess } from "child_process";
import * as readline from "readline";
import { Engine } from "@hiryu/usi";
export declare class NodeEngineProcess extends Engine {
    process: ChildProcess;
    rl: readline.ReadLine;
    constructor(binPath: string);
    protected writeln(line: string): void;
    protected exit(): void;
}
