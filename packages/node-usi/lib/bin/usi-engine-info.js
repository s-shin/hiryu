#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const yargs_1 = __importDefault(require("yargs"));
const argv = yargs_1.default
    .usage("$0 <binary-path>", "output engine information", (a) => {
    a.positional("binary-path", {
        describe: "the binary path of an USI engine",
        type: "string",
    });
})
    .option("pretty", {
    describe: "output more human-readable",
    type: "boolean",
})
    .option("verbose", {
    describe: "verbose output",
    type: "boolean",
})
    .argv;
const engine = new index_1.NodeEngineProcess(argv.binaryPath);
if (argv.verbose) {
    engine.on("debug", (msg, ...args) => {
        console.log(`DEBUG: ${msg}`, ...args);
    });
}
engine.on("error", err => {
    console.error(err);
});
engine.on("configure", () => {
    console.log(JSON.stringify(engine.info, null, argv.pretty ? 2 : undefined));
    engine.quit();
});
engine.start();
//# sourceMappingURL=usi-engine-info.js.map