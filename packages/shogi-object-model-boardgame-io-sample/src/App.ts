import { Client } from "boardgame.io/react";
import Shogi from "./Shogi";
import ShogiView from "./ShogiView";

const App = Client({
  game: Shogi,
  board: ShogiView,
});

export default App;
