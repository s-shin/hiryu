#!/usr/bin/env node
import { NodeEngineProcess } from "../index";
import yargs from "yargs";

const argv = yargs
  .usage("$0 <binary-path>", "output engine information", (a: any) => {
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

const engine = new NodeEngineProcess(argv.binaryPath);

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
