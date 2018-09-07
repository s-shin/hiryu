import * as usi from "@hiryu/usi";
export interface GoResult {
    bestmove: string;
    details: usi.Info[];
}
export declare function go(opts: {
    engineName: string;
    state: string;
    moves: string;
    timeout: number;
}): Promise<GoResult>;
