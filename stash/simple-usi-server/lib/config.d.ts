/// <reference types="config" />
import _config from "config";
export declare let config: _config.IConfig;
export declare function reloadConfig(): void;
export declare function validateConfig(): Error | null;
export declare function getSupportedEngines(): string[];
export declare function isSupportedEngine(engineName: string): boolean;
export declare function mustBeSupportedEngine(engineName: string): void;
export declare function pathFilter(p: string): string;
export interface EngineConfig {
    path: string;
    options: {
        [key: string]: string;
    };
}
export declare function getEngineConfig(engineName: string): EngineConfig;
export interface EngineProcessPoolConfig {
    limit: number;
}
export declare function getEngineProcessPoolConfig(engineName: string): EngineProcessPoolConfig;
