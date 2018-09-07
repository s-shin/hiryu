export interface EngineOptionsConfig {
    [name: string]: string;
}
export interface EngineConfig {
    path: string;
    options: EngineOptionsConfig;
}
export interface EnginesConfig {
    [name: string]: EngineConfig;
}
export interface Config {
    engines: EnginesConfig;
}
