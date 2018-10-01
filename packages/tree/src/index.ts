import produce, { Draft } from "immer";
import isEqual from "lodash.isequal";

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

export function pathEquals(lhs: Path, rhs: Path) {
  return isEqual(lhs, rhs);
}

export function nodeEquals<T>(lhs: Node<T>, rhs: Node<T>, opts?: { strict: boolean }) {
  return opts && opts.strict
    ? isEqual(lhs, rhs)
    : lhs.tree === lhs.tree && pathEquals(lhs.path, rhs.path);
}

export function updateNodePath<T>(node: Node<T>, path: Path) {
  return { tree: node.tree, path };
}

export function getRootNode<T>(node: Node<T>) {
  return updateNodePath(node, ROOT_PATH);
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

export function getValue<T>(node: Node<T>) {
  const t = getLastForkTree(node.tree, node.path);
  if (node.path.depth >= t.values.length) {
    throw new Error("value not found");
  }
  return t.values[node.path.depth];
}

export function getLeafNode<T>(tree: Tree<T>, points: PathPoint[]) {
  const t = getLastForkTree(tree, { points, depth: 0 });
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
  const t = getLastForkTree(node.tree, node.path);
  const forkTrees = t.forks[nextDepth];
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
    draft.path.depth = 0;
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
      return true;
    }
  }
  return false;
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
  const points = [...node.path.points];
  const p = points.pop()!;
  const path = { points, depth: 0 };
  path.depth = p.depth - 1;
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
  if (points && points.length > node.path.points.length) {
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
  if (isLeafNode(node)) {
    return;
  }
  return {
    tree: node.tree,
    path: { points: node.path.points, depth },
  };
};

export function walkTowardsParent<T>(node: Node<T>, pred: Predicate<T>, opts?: WalkOptions) {
  return walk(node, towardsParent(pred), opts);
}

export function walkTowardsChild<T>(
  node: Node<T>,
  pred: Predicate<T>,
  opts?: WalkOptions & { points?: PathPoint[] },
) {
  return walk(node, towardsChild<T>(opts && opts.points)(pred), opts);
}

export function findNode<T>(
  node: Node<T>,
  director: PredicableWalkDirector<T>,
  pred: Predicate<T>,
  opts?: WalkOptions,
): Node<T> | undefined {
  let r: Node<T> | undefined;
  walk(
    node,
    director((node, i) => {
      if (pred(node, i)) {
        r = node;
        return false;
      }
      return true;
    }),
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

export function getParentNode<T>(node: Node<T>) {
  return findParentNode(node, (node, i) => i === 1);
}

export function getSiblings<T>(node: Node<T>) {
  const n = getParentNode(node);
  return n ? getChildNodes(n) : [];
}

export function filter<T>(
  node: Node<T>,
  director: PredicableWalkDirector<T>,
  pred: Predicate<T>,
  opts?: WalkOptions,
): Node<T>[] {
  const r: Node<T>[] = [];
  walk(
    node,
    director((node, i) => {
      if (pred(node, i)) {
        r.push(node);
      }
      return true;
    }),
    opts,
  );
  return r;
}

//---

//! experimental
export class NodeWrapper<T> {
  currentTree: Tree<T>;

  static from<T>(node: Node<T>) {
    return new NodeWrapper(node);
  }

  constructor(public node: Node<T>) {
    this.currentTree = getLastForkTree(node.tree, node.path);
  }

  get path() {
    return this.node.path;
  }

  get value(): T {
    return this.currentTree.values[this.path.depth];
  }

  get isRoot() {
    return isRootPath(this.path);
  }

  get parent(): NodeWrapper<T> | undefined {
    const n = getParentNode(this.node);
    return n && new NodeWrapper(n);
  }

  get children(): NodeWrapper<T>[] {
    return getChildNodes(this.node).map(node => new NodeWrapper(node));
  }

  get siblings(): NodeWrapper<T>[] {
    return getSiblings(this.node).map(node => new NodeWrapper(node));
  }
}
