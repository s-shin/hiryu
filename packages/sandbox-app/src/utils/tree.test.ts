import * as tree from "./tree";

describe("tree", () => {
  interface Node {
    name: string;
    parent?: Node;
    children: Node[];
  }
  const newNode = (name: string, parent?: Node): Node => {
    const node = { name, parent, children: [] };
    if (parent) {
      parent.children.push(node);
    }
    return node;
  };
  const root = newNode("root");
  const inner1 = newNode("inner1", root);
  const node1_1 = newNode("node1_1", inner1);
  const leaf1 = newNode("leaf1", node1_1);
  const inner2 = newNode("inner2", root);
  const leaf2 = newNode("leaf2", inner2);

  test("getRootNode", () => {
    expect(tree.getRootNode(leaf1).name).toBe(root.name);
  });

  test("getLeafNode", () => {
    expect(tree.getLeafNode(root, [inner1]).name).toBe(leaf1.name);
  });

  test("getRouteFromRoot", () => {
    expect(tree.getRouteFromRoot(leaf2).route.map(n => n.name)).toEqual([inner2.name]);
  });

  test("findParent", () => {
    expect(tree.findParent(leaf1, n => n.name === inner1.name).name).toBe(inner1.name);
  });
});
