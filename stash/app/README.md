### @hiryu/app - main application

WIP

---

```sh
yarn web-client dev
yarn web-server:run dev
yarn web-server:build -w
```

---

## Two Targets

### Web Application

```
Client [src/web-client]
 | WebSocket
Server [src/web-server]
 | IPC (pipe)
Engines [@hiryu/node-usi]
```

### Electron

```
Renderer Process [src/electron-renderer]
 | IPC (electron)
Main Process [src/electron-main]
 | IPC (pipe)
Engines [@hiryu/node-usi]
```

---

```sh
for file in ./static/kif/*.kif; do cat "$file" | ./script/fix-kif | ./script/kif2jkf > static/jkf/$(basename $file ".kif").json; done
```
