import { NodeEngineProcess } from "@hiryu/node-usi";
export declare class EngineProcessEntry {
    id: number;
    engineName: string;
    process: NodeEngineProcess;
    isLocked: boolean;
    constructor(id: number, engineName: string, process: NodeEngineProcess, isLocked: boolean);
    toString(): string;
}
export declare class EngineProcessPool {
    lastId: number;
    entries: EngineProcessEntry[];
    aquire(engineName: string): Promise<NodeEngineProcess | undefined>;
    release(engineProcess: NodeEngineProcess): void;
    private createEntry(engineName);
}
export declare const engineProcessPool: EngineProcessPool;
