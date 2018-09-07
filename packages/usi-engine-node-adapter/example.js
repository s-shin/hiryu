const process = require("process");
const NodeEngineAdapter = require("./lib").default;
const Engine = require("@hiryu/usi-engine").Engine;

if (process.argv.length !== 3) {
  process.exit(1);
}

let engine = new Engine(new NodeEngineAdapter(process.argv[2]));

engine.on("debug", msg => {
  console.log(`debug: ${msg}`);
});

engine.on("configure", availableOptions => {
  console.log({ availableOptions });
  engine.newGame();
});

engine.on("info", info => {
  if (info.string) {
    console.log(`info: ${info.string}`);
  } else {
    console.log({ info });
  }
});

engine.on("ready", () => {
  console.log("!!! game is ready");
  engine.setGameState();
  engine.go();
});

engine.on("bestmove", move => {
  console.log(`!!! bestmove: ${move}`);
  engine.quit();
});

engine.on("error", err => {
  console.error(err);
});

engine.on("exit", () => {
  console.log("!!! exit");
  engine = null;
});

engine.start();
