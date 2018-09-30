import produce, { Draft } from "immer";

export type Value<T> = Draft<T>;

export interface Tree<T> {
  values: T[];
  forks: Forks<T>;
}

export interface Forks<T> {
  //! depth should be greater than 0.
  [depth: number]: Tree<T>[] | undefined;
}

export interface PathPoint {
  depth: number;
  forkIndex: number;
}

export interface Path {
  points: PathPoint[];
  //! The index of values of last fork tree.
  depth: number;
}

export const ROOT_PATH: Path = Object.freeze({ points: [], depth: 0 });

export interface Node<T> {
  tree: Tree<T>;
  path: Path;
}

//---

export function newTree<T>(v: T): Tree<T> {
  return { values: [v], forks: newForks() };
}

export function newForks<T>(): Forks<T> {
  return {};
}

export function newRootNode<T>(v: T): Node<T> {
  return { tree: newTree(v), path: ROOT_PATH };
}

export function isRootPath(path: Path) {
  return path.points.length === 0 && path.depth === 0;
}

export function getForkTree<T>(tree: Tree<T>, p: PathPoint): Tree<T> {
  const trees = tree.forks[p.depth];
  if (!trees) {
    throw new Error("fork not found");
  }
  return trees[p.forkIndex];
}

export function getLastForkTree<T>(tree: Tree<T>, path: Path): Tree<T> {
  let t = tree;
  for (const p of path.points) {
    t = getForkTree(t, p);
  }
  return t;
}

export function getLeafNode<T>(tree: Tree<T>, points: PathPoint[]) {
  const t = getLastForkTree(tree, { points, depth: 0 });
  if (!t) {
    throw new Error("fork tree not found");
  }
  return { tree: t, path: { points, depth: t.values.length - 1 } };
}

export function isRootNode<T>(node: Node<T>) {
  return isRootPath(node.path);
}

//! @note Forks from leaf node were not checked.
export function isLeafNode<T>(node: Node<T>) {
  const t = getLastForkTree(node.tree, node.path);
  return node.path.depth === t.values.length - 1;
}

export function getChildNodes<T>(node: Node<T>) {
  const r: Node<T>[] = [];
  const nextDepth = node.path.depth + 1;
  if (nextDepth < node.tree.values.length) {
    r.push({
      tree: node.tree,
      path: { points: node.path.points, depth: nextDepth },
    });
  }
  const forkTrees = node.tree.forks[nextDepth];
  if (forkTrees) {
    for (let i = 0; i < forkTrees.length; i++) {
      r.push({
        tree: node.tree,
        path: {
          points: [...node.path.points, { depth: nextDepth, forkIndex: i }],
          depth: 0,
        },
      });
    }
  }
  return r;
}

export function appendChild<T>(node: Node<T>, value: Value<T>): Node<T> {
  return produce(node, draft => {
    const t = getLastForkTree(draft.tree, draft.path);
    if (!t) {
      throw new Error("invalid tree");
    }
    const nextDepth = draft.path.depth + 1;
    if (nextDepth === t.values.length) {
      t.values.push(value);
      draft.path.depth++;
      return;
    }
    if (!t.forks[nextDepth]) {
      t.forks[nextDepth] = [];
    }
    const ts = t.forks[nextDepth];
    draft.path.points.push({
      depth: nextDepth,
      forkIndex: ts ? ts.length : 0,
    });
    ts!.push(newTree(value));
  });
}

//---

export interface WalkOptions {
  limit?: number;
  trace?: (i: number, path: Path) => void;
}

export const DEFAULT_WALK_OPTIONS = {
  limit: 1000000,
};

export type WalkDirector<T> = (node: Node<T>, i: number) => Node<T> | undefined;

export function walk<T>(node: Node<T>, director: WalkDirector<T>, opts?: WalkOptions) {
  const limit = (opts && opts.limit) || DEFAULT_WALK_OPTIONS.limit;
  let next: Node<T> | undefined = node;
  for (let i = 0; i < limit; i++) {
    if (opts && opts.trace) {
      opts.trace(i, next.path);
    }
    next = director(next!, i);
    if (!next) {
      break;
    }
  }
}

export type Predicate<T> = (node: Node<T>, i: number) => boolean;

export type PredicableWalkDirector<T> = (pred: Predicate<T>) => WalkDirector<T>;

export const towardsParent /* : <T> PredicableWalkDirector<T> */ = <T>(
  pred: Predicate<T>,
): WalkDirector<T> => (node, i) => {
  if (!pred(node, i)) {
    return;
  }
  const depth = node.path.depth - 1;
  if (depth >= 0) {
    return {
      tree: node.tree,
      path: { points: node.path.points, depth },
    };
  }
  if (node.path.points.length === 0) {
    return; // root
  }
  const points = node.path.points.slice(0, node.path.points.length - 1);
  const path = { points, depth: 0 };
  const t = getLastForkTree(node.tree, path);
  path.depth = t.values.length - 1;
  return { tree: node.tree, path };
};

export const towardsChild = <T>(points?: PathPoint[]): PredicableWalkDirector<T> => pred => (
  node,
  i,
) => {
  if (!pred(node, i)) {
    return;
  }
  const depth = node.path.depth + 1;
  if (points) {
    const point = points[node.path.points.length];
    if (depth === point.depth) {
      return {
        tree: node.tree,
        path: {
          points: [...node.path.points, point],
          depth: 0,
        },
      };
    }
  }
  return {
    tree: node.tree,
    path: { points: node.path.points, depth },
  };
};

export function findNode<T>(
  node: Node<T>,
  director: PredicableWalkDirector<T>,
  pred: Predicate<T>,
  opts?: WalkOptions,
): Node<T> | undefined {
  let r: Node<T> | undefined;
  walk(
    node,
    (node, i) =>
      director((node, i) => {
        if (pred(node, i)) {
          r = node;
          return false;
        }
        return true;
      })(node, i),
    opts,
  );
  return r;
}

export function findParentNode<T>(
  node: Node<T>,
  pred: Predicate<T>,
  opts?: WalkOptions,
): Node<T> | undefined {
  return findNode(node, towardsParent, pred, opts);
}

export function findChildNode<T>(
  node: Node<T>,
  pred: Predicate<T>,
  points?: PathPoint[],
  opts?: WalkOptions,
): Node<T> | undefined {
  return findNode(node, towardsChild(points), pred, opts);
}

//---

// export class Node<T> {
//   currentTree: Tree<T>;

//   static from<T>(info: NodeInfo<T>) {
//     return new Node(info);
//   }

//   constructor(public info: NodeInfo<T>) {
//     const t = getLastForkTree(info.tree, info.path);
//     if (!t) {
//       throw new Error("fork tree not found");
//     }
//     this.currentTree = t;
//     if (t.values.length <= info.path.depth) {
//       throw new Error("value not found");
//     }
//   }

//   get path() {
//     return this.info.path;
//   }

//   get value(): T {
//     return this.currentTree.values[this.path.depth];
//   }

//   get isRoot() {
//     return isRootPath(this.path);
//   }

//   get parent(): Node<T> | undefined {
//     if (this.isRoot) {
//       return;
//     }
//     const info = getParentNodeInfo(this.info);
//     if (!info) {
//       return info;
//     }
//     return Node.from(info);
//   }

//   get children(): Node<T>[] {
//     return getChildren(this.info).map(info => new Node(info));
//   }
// }
