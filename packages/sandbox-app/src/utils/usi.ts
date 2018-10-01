import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";

export function getGameState(gameNode: som.rules.standard.GameNode) {
  const root = tree.getRootNode(gameNode);
  const rootData = tree.getValue(root);
  const sfen = som.formats.usi.stringifySFEN({
    nextMoveNum: rootData.moveNum + 1,
    state: rootData.state,
  });
  const moves: string[] = [];
  tree.walkTowardsChild(
    root,
    node => {
      const data = tree.getValue(node);
      const event = data.byEvent;
      if (event && event.type === som.EventType.MOVE) {
        const move = som.formats.usi.stringifyMove({
          srcSquare: event.srcSquare,
          srcPiece: event.srcPiece,
          dstSquare: event.dstSquare!,
          promote: event.promote,
        });
        moves.push(move);
      }
      if (tree.pathEquals(node.path, gameNode.path)) {
        return false;
      }
      return true;
    },
    { points: gameNode.path.points },
  );
  return { state: `sfen ${sfen}`, moves: moves.join(" ") };
}
