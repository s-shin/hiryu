import * as som from "@hiryu/shogi-object-model";

let root = som.rules.standard.newRootGameNode();
const next = som.rules.standard.applyEvent(root, {
  type: som.EventType.MOVE,
  color: som.Color.BLACK,
  srcSquare: [7, 7],
  dstSquare: [7, 6],
});
root.children.push(next);

export const leafGameNode = next;
