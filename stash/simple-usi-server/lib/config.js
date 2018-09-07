"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const config_1 = __importDefault(require("config"));
exports.config = config_1.default;
// tslint:disable-next-line no-var-requires
const schema = require(path_1.default.resolve(__dirname, "../config/schema.json"));
const ajv = new ajv_1.default();
const validateBySchema = ajv.compile(schema);
function reloadConfig() {
    delete require.cache[require.resolve("config")];
    // tslint:disable-next-line no-var-requires
    exports.config = require("config");
}
exports.reloadConfig = reloadConfig;
function validateConfig() {
    if (!validateBySchema(exports.config)) {
        return new Error(ajv.errorsText());
    }
    return null;
}
exports.validateConfig = validateConfig;
function getSupportedEngines() {
    return Object.keys(exports.config.get("engines"));
}
exports.getSupportedEngines = getSupportedEngines;
function isSupportedEngine(engineName) {
    return exports.config.has(`engines.${engineName}`);
}
exports.isSupportedEngine = isSupportedEngine;
function mustBeSupportedEngine(engineName) {
    if (!isSupportedEngine(engineName)) {
        throw new Error(`not supported engine: ${engineName}`);
    }
}
exports.mustBeSupportedEngine = mustBeSupportedEngine;
function pathFilter(p) {
    return p.replace("$HOME", process_1.default.env.HOME);
}
exports.pathFilter = pathFilter;
function getEngineConfig(engineName) {
    return exports.config.get(`engines.${engineName}`);
}
exports.getEngineConfig = getEngineConfig;
function getEngineProcessPoolConfig(engineName) {
    return exports.config.get(`engineProcessPool.${engineName}`);
}
exports.getEngineProcessPoolConfig = getEngineProcessPoolConfig;
//# sourceMappingURL=config.js.map