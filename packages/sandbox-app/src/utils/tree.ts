export interface NodeProps<T> {
  children: T[];
  parent?: T;
}

export type Route<T extends NodeProps<T>> = T[];

export function getRootNode<T extends NodeProps<T>>(node: T): T {
  let n = node;
  while (n.parent) {
    n = n.parent;
  }
  return n;
}

export function getLeafNode<T extends NodeProps<T>>(node: T, route: Route<T>): T {
  traverseRoute(node, route, n => (node = n));
  return node;
}

export function getRouteFromRoot<T extends NodeProps<T>>(node: T): { root: T; route: Route<T> } {
  const route: Route<T> = [];
  while (node.parent) {
    const idx = node.parent.children.indexOf(node);
    if (idx > 0) {
      route.unshift(node);
    }
    node = node.parent;
  }
  return { root: node, route };
}

export function traverse<T extends NodeProps<T>>(
  node: T,
  cb: (node: T, i: number) => T | undefined,
) {
  let i = 0;
  let n: T | undefined = node;
  while (n) {
    n = cb(n, i++);
  }
}

export function traverseRoute<T extends NodeProps<T>>(
  node: T,
  route: Route<T>,
  cb: (node: T, depth: number) => any,
) {
  let depth = 0;
  let n: T | undefined = node;
  let routeIdx = 0;
  while (n) {
    if (cb(n, depth++) === false) {
      break;
    }
    let childIdx = 0;
    if (routeIdx < route.length) {
      childIdx = Math.max(n.children.indexOf(route[routeIdx]), 0);
    }
    n = n.children[childIdx];
  }
}

export function findAlongRoute<T extends NodeProps<T>>(
  node: T,
  route: Route<T>,
  pred: (node: T, depth: number) => any,
): T | undefined {
  let match: T | undefined;
  traverseRoute(node, route, (node, depth) => {
    if (pred(node, depth)) {
      match = node;
      return false;
    }
  });
  return match;
}

export function findParent<T extends NodeProps<T>>(
  node: T,
  pred: (node: T, i: number) => any,
): T | undefined {
  let match: T | undefined;
  traverse(node, (n, i) => {
    if (pred(n, i)) {
      match = n;
      return;
    }
    return n.parent;
  });
  return match;
}

export function isDescendant<T extends NodeProps<T>>(node: T, descendant: T) {
  return Boolean(findParent(descendant, n => n === node));
}

export function appendChild<T extends NodeProps<T>>(parent: T, child: T) {
  parent.children.push(child);
  child.parent = parent;
}
