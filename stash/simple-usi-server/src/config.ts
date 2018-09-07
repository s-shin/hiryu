import process from "process";
import path from "path";
import Ajv from "ajv";
import _config from "config";

export let config = _config;

// tslint:disable-next-line no-var-requires
const schema = require(path.resolve(__dirname, "../config/schema.json"));
const ajv = new Ajv();
const validateBySchema = ajv.compile(schema);

export function reloadConfig() {
  delete require.cache[require.resolve("config")];
  // tslint:disable-next-line no-var-requires
  config = require("config");
}

export function validateConfig(): Error | null {
  if (!validateBySchema(config)) {
    return new Error(ajv.errorsText());
  }
  return null;
}

export function getSupportedEngines() {
  return Object.keys(config.get("engines"));
}

export function isSupportedEngine(engineName: string) {
  return config.has(`engines.${engineName}`);
}

export function mustBeSupportedEngine(engineName: string) {
  if (!isSupportedEngine(engineName)) {
    throw new Error(`not supported engine: ${engineName}`);
  }
}

export function pathFilter(p: string) {
  return p.replace("$HOME", process.env.HOME!);
}

export interface EngineConfig {
  path: string;
  options: {
    [key: string]: string;
  };
}

export function getEngineConfig(engineName: string) {
  return config.get<EngineConfig>(`engines.${engineName}`);
}

export interface EngineProcessPoolConfig {
  limit: number;
}

export function getEngineProcessPoolConfig(engineName: string) {
  return config.get<EngineProcessPoolConfig>(`engineProcessPool.${engineName}`);
}
