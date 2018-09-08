import { Engine } from "@hiryu/usi-engine";
import WebSocketAdapter from "@hiryu/usi-engine-websocket-adapter";

const engine = new Engine(
  new WebSocketAdapter({
    hooks: {
      onMessage: data => data + "\n",
      onWriteLine: line => line,
    },
  }),
);

engine.on("debug", msg => {
  console.log({ debug: msg });
});

engine.on("error", e => {
  console.error({ error: e });
});

engine.on("configure", opts => {
  console.log({ configure: opts });
  engine.newGame();
});

engine.on("info", info => {
  console.log({ info: info.string || info });
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

engine.start();
