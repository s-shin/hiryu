// import * as usi from "@hiryu/usi";
// import * as usiService from "../common/services/usi";
//
// async function main() {
//   if (!process.env.hoge) {
//     return;
//   }
//   const svc = usiService.provider.use();
//   console.log("initialize");
//   await svc.initialize();
//   svc.on("info", info => {
//     console.log(info);
//   });
//   console.log("newGame");
//   await svc.newGame();
//   console.log("setGameState");
//   await svc.setGameState("startpos", "7g7f");
//   console.log("go");
//   await svc.go(usi.DEFAULT_GO_OPTIONS);
// }
//
// main();
