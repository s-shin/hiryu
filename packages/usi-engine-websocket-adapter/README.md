# @hiryu/usi-engine-websocket-adapter

```sh
websocketd --address 127.0.0.1 --port 3001 some-usi-engine
```

```ts
const engine = new Engine(new WebsocketAdapter({ host: "127.0.0.1", port: 3001 }));
engine.start();
```

