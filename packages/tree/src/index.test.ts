import * as tree from "./index";

describe("tree", () => {
  const sampleTrees: tree.Tree<number>[] = [
    {
      values: [1, 2, 3],
      forks: {},
    },
    {
      values: [10, 20, 30],
      forks: {},
    },
    {
      values: [100, 200, 300],
      forks: {},
    },
    {
      values: [1000, 2000],
      forks: {},
    },
    {
      values: [10000],
      forks: {},
    },
  ];
  sampleTrees[0].forks[1] = [sampleTrees[1], sampleTrees[2]];
  sampleTrees[2].forks[2] = [sampleTrees[3]];
  sampleTrees[3].forks[1] = [sampleTrees[4]];

  const pathToSampleTree4: tree.Path = {
    points: [{ depth: 1, forkIndex: 1 }, { depth: 2, forkIndex: 0 }, { depth: 1, forkIndex: 0 }],
    depth: 0,
  };

  const sampleRootNode = { tree: sampleTrees[0], path: tree.ROOT_PATH };
  const sampleLeafNode = { tree: sampleTrees[0], path: pathToSampleTree4 };

  it("isRootPath, ROOT_PATH", () => {
    expect(tree.isRootPath(tree.ROOT_PATH)).toBe(true);
    expect(tree.isRootPath({ points: [], depth: 1 })).toBe(false);
  });

  it("appendChild", () => {
    const n1a = tree.newRootNode(1);
    const n1b = tree.appendChild(n1a, 2);
    expect(n1b).toEqual({
      tree: { values: [1, 2], forks: {} },
      path: { points: [], depth: 1 },
    });

    const n2a = { ...n1b, path: tree.ROOT_PATH };
    const n2b = tree.appendChild(n2a, 3);
    expect(n2b).toEqual({
      tree: { values: [1, 2], forks: { 1: [{ values: [3], forks: {} }] } },
      path: { points: [{ depth: 1, forkIndex: 0 }], depth: 0 },
    });
  });

  it("find", () => {
    const n1 = tree.findChildNode(sampleRootNode, tree.isLeafNode, pathToSampleTree4.points);
    expect(n1!.path).toEqual(pathToSampleTree4);
    const n2 = tree.findParentNode(sampleLeafNode, tree.isRootNode);
    expect(n2!.path).toEqual(tree.ROOT_PATH);
  });

  it("getParentNode", () => {
    expect(tree.getParentNode(sampleRootNode)).toBeUndefined();
    expect(
      tree.getParentNode({ tree: sampleTrees[0], path: { points: [], depth: 1 } }).path,
    ).toEqual(tree.ROOT_PATH);
  });

  it("getChildNodes", () => {
    const cs1 = tree.getChildNodes(sampleRootNode);
    expect(cs1.map(n => n.path)).toEqual([
      { points: [], depth: 1 },
      { points: [{ depth: 1, forkIndex: 0 }], depth: 0 },
      { points: [{ depth: 1, forkIndex: 1 }], depth: 0 },
    ]);
    const cs2 = tree.getChildNodes(cs1[0]);
    expect(cs2.map(n => n.path)).toEqual([{ points: [], depth: 2 }]);
  });
});
