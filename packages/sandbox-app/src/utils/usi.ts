import * as som from "@hiryu/shogi-object-model";
import * as tree from "./tree";

export function getGameState(node: som.rules.standard.GameNode) {
  const { root, route } = tree.getNodeInfo(node);
  const sfen = som.formats.usi.stringifySFEN({
    nextMoveNum: root.moveNum + 1,
    state: root.state,
  });
  const moves: string[] = [];
  tree.traverseRoute(root, route, node => {
    const event = node.byEvent;
    if (event && event.type === som.EventType.MOVE) {
      const move = som.formats.usi.stringifyMove({
        srcSquare: event.srcSquare,
        srcPiece: event.srcPiece,
        dstSquare: event.dstSquare!,
        promote: event.promote,
      });
      moves.push(move);
    }
  });
  return { state: `sfen ${sfen}`, moves: moves.join(" ") };
}
